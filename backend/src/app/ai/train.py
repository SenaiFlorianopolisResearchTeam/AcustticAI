import json
import shutil
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import mlflow
import mlflow.pytorch
import torch
from core.logger import get_logger
from core.settings import settings
from mlflow.tracking import MlflowClient
from roboflow import Roboflow
from ultralytics import YOLO

logger = get_logger("ai.train")


class DatasetSetupError(Exception):
    """Custom exception for dataset setup failures."""


class YOLOMLFlowTrainer:
    def __init__(
        self,
        mlflow_tracking_uri: str | None = None,
        experiment_name: str | None = None,
        model_local_dir: str | None = None
    ):
        self.mlflow_tracking_uri = mlflow_tracking_uri or settings.mlflow_tracking_uri
        self.experiment_name = experiment_name or settings.mlflow_experiment_name
        self.model_local_dir = Path(model_local_dir or settings.model_save_dir)

        self.model_local_dir.mkdir(parents=True, exist_ok=True)

        mlflow.set_tracking_uri(self.mlflow_tracking_uri)
        mlflow.set_experiment(self.experiment_name)
        self.client = MlflowClient()

        logger.info(f"Initialized YOLOMLFlowTrainer with experiment: {self.experiment_name}")

    def setup_roboflow_dataset(
        self,
        api_key: str | None = None,
        workspace: str | None = None,
        project: str | None = None,
        version: int | None = None,
        data_format: str = "yolov11",
        download_dir: str | None = None
    ) -> str:
        api_key = api_key or settings.roboflow_api_key
        workspace = workspace or settings.roboflow_workspace
        project = project or settings.roboflow_project
        version = version or settings.roboflow_version
        download_dir = download_dir or settings.dataset_dir

        if not api_key:
            msg = "Roboflow API key is required. Set ROBOFLOW_API_KEY environment variable."
            logger.error(msg)
            raise ValueError(msg)

        def _validate_dataset_path(yaml_path: Path) -> None:
            if not yaml_path.exists():
                error_msg = f"data.yaml not found at {yaml_path}"
                logger.error(error_msg)
                raise FileNotFoundError(error_msg)

        try:
            logger.debug(f"Downloading dataset from Roboflow: {workspace}/{project} v{version}")
            rf = Roboflow(api_key=api_key)
            project_obj = rf.workspace(workspace).project(project)
            project_obj.version(version).download(data_format, location=download_dir)

            dataset_path = Path(download_dir) / f"{project}-{version}"
            yaml_path = dataset_path / "data.yaml"

            _validate_dataset_path(yaml_path)

            with mlflow.start_run(nested=True):
                mlflow.log_param("dataset_source", "roboflow")
                mlflow.log_param("workspace", workspace)
                mlflow.log_param("project", project)
                mlflow.log_param("version", version)
                mlflow.log_artifact(str(yaml_path), "dataset_config")

            logger.info(f"Dataset successfully configured: {yaml_path}")
            return str(yaml_path)

        except Exception as e:
            logger.exception("Failed to setup dataset")
            raise DatasetSetupError(f"Dataset setup failed: {e!s}") from e

    def get_optimized_hyperparams(
        self,
        epochs: int = 100,
        img_size: int = 640,
        model_size: str = "n",
        **kwargs
    ) -> dict[str, Any]:
        base_config = {
            "batch": settings.batch_size,
            "workers": settings.workers,
            "device": settings.device,
            "epochs": epochs,
            "imgsz": img_size,
            "lr0": 0.01,
            "momentum": 0.937,
            "weight_decay": 0.0005,
            "warmup_epochs": 3,
            "optimizer": "AdamW",
            "patience": 50,
            "save_period": 10,
            "val": True,
            "plots": True,
            "save": True,
            "amp": True,
            "cache": "ram"
        }

        model_batch_sizes = {
            "n": 20,
            "s": 16,
            "m": 12,
            "l": 8,
            "x": 6
        }

        if model_size in model_batch_sizes:
            base_config["batch"] = model_batch_sizes[model_size]

        base_config.update(kwargs)
        return base_config

    def train_with_mlflow(
        self,
        data_yaml_path: str,
        model_size: str = "n",
        epochs: int = 100,
        run_name: str | None = None,
        tags: dict[str, str] | None = None,
        **kwargs
    ) -> dict[str, Any]:
        model_name = f"yolo11{model_size}.pt"

        with mlflow.start_run(run_name=run_name) as run:
            try:
                logger.info(f"Starting MLFlow run: {run.info.run_id}")

                if tags:
                    mlflow.set_tags(tags)

                hyperparams = self.get_optimized_hyperparams(
                    epochs=epochs,
                    model_size=model_size,
                    **kwargs
                )

                mlflow.log_params(hyperparams)
                mlflow.log_param("model_type", model_name)
                mlflow.log_param("dataset_path", data_yaml_path)

                model = YOLO(model_name)

                logger.info(f"Starting YOLO11{model_size.upper()} training")
                logger.info(f"Run ID: {run.info.run_id}")
                logger.info(f"Epochs: {epochs}, Batch size: {hyperparams['batch']}")

                output_dir = self.model_local_dir / f"run_{run.info.run_id}"
                hyperparams.update({
                    "data": data_yaml_path,
                    "project": str(output_dir.parent),
                    "name": output_dir.name,
                    "exist_ok": True
                })

                def on_train_epoch_end(trainer):
                    if hasattr(trainer, "metrics"):
                        metrics = trainer.metrics
                        epoch = trainer.epoch

                        metrics_to_log = {
                            "train_box_loss": "train/box_loss",
                            "train_cls_loss": "train/cls_loss",
                            "val_box_loss": "val/box_loss",
                            "val_cls_loss": "val/cls_loss",
                            "mAP50": "metrics/mAP50(B)",
                            "mAP50_95": "metrics/mAP50-95(B)"
                        }

                        for mlflow_key, trainer_key in metrics_to_log.items():
                            if trainer_key in metrics:
                                mlflow.log_metric(mlflow_key, metrics[trainer_key], step=epoch)

                model.add_callback("on_train_epoch_end", on_train_epoch_end)

                logger.info("Starting model training...")
                results = model.train(**hyperparams)

                final_metrics = {
                    "final_mAP50": float(results.box.map50),
                    "final_mAP50_95": float(results.box.map),
                    "final_precision": float(results.box.mp),
                    "final_recall": float(results.box.mr),
                    "final_fitness": float(results.fitness)
                }
                mlflow.log_metrics(final_metrics)

                weights_dir = results.save_dir / "weights"
                best_model_path = weights_dir / "best.pt"

                mlflow.log_artifacts(str(weights_dir), "model_weights")
                mlflow.log_artifacts(str(results.save_dir), "training_results")

                logger.info("Registering model in MLFlow Model Registry...")
                model_info = mlflow.pytorch.log_model(
                    pytorch_model=model,
                    artifact_path="ai",
                    registered_model_name="yolo11_acusttic_ai",
                    metadata={
                        "model_size": model_size,
                        "epochs": epochs,
                        "mAP50": float(results.box.map50),
                        "mAP50_95": float(results.box.map),
                        "training_date": datetime.now(UTC).isoformat()
                    }
                )

                self._update_local_model(best_model_path, model_size, run.info.run_id)

                training_info = {
                    "run_id": run.info.run_id,
                    "model_uri": model_info.model_uri,
                    "model_size": model_size,
                    "epochs": epochs,
                    "best_mAP50": float(results.box.map50),
                    "best_mAP50_95": float(results.box.map),
                    "local_model_path": str(self.model_local_dir / f"latest_yolo11{model_size}.pt"),
                    "training_completed": True
                }

                logger.info("Training completed successfully")
                logger.info(f"mAP@0.5: {results.box.map50:.4f}")
                logger.info(f"mAP@0.5:0.95: {results.box.map:.4f}")
                logger.info(f"Model registered: {model_info.model_uri}")

            except Exception as e:
                mlflow.log_param("error", str(e))
                logger.exception("Training failed")
                raise
            else:
                return training_info

    def _update_local_model(self, best_model_path: Path, model_size: str, run_id: str):
        logger.debug(f"Updating local model for size {model_size}")

        local_pattern = f"*yolo11{model_size}*"
        for old_model in self.model_local_dir.glob(local_pattern):
            logger.debug(f"Removing old model: {old_model}")
            old_model.unlink(missing_ok=True)

        new_local_path = self.model_local_dir / f"latest_yolo11{model_size}.pt"
        shutil.copy2(best_model_path, new_local_path)

        metadata = {
            "model_size": model_size,
            "run_id": run_id,
            "updated_at": datetime.now(UTC).isoformat(),
            "source_path": str(best_model_path)
        }

        metadata_path = self.model_local_dir / f"latest_yolo11{model_size}_metadata.json"
        with open(metadata_path, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)

        logger.info(f"Local model updated: {new_local_path}")

    def get_latest_model_from_registry(
        self,
        model_name: str = "yolo11_acusttic_ai",
        stage: str = "Production"
    ) -> str | None:
        try:
            latest_version = self.client.get_latest_versions(
                model_name,
                stages=[stage]
            )[0]

            model_uri = f"model:/{model_name}/{latest_version.version}"
            logger.info(f"Found model in registry: {model_uri}")

        except Exception as e:
            logger.warning(f"Failed to get model from registry: {e}")
            return None
        else:
            return model_uri

    def download_model_for_deployment(
        self,
        model_name: str = "yolo11_acusttic_ai",
        stage: str = "Production"
    ) -> str | None:
        model_uri = self.get_latest_model_from_registry(model_name, stage)

        if model_uri:
            try:
                logger.info(f"Downloading model for deployment: {model_uri}")
                local_model = mlflow.pytorch.load_model(model_uri)
                deployment_path = self.model_local_dir / "deployment_model.pt"

                torch.save(local_model, deployment_path)

                logger.info(f"Deployment model saved: {deployment_path}")
                return str(deployment_path)
            except Exception:
                logger.exception("Failed to download deployment model")

        return None

    def evaluate_model(
        self,
        model_path: str,
        data_yaml_path: str,
        *,
        log_to_mlflow: bool = True
    ) -> dict[str, Any]:
        logger.info(f"Evaluating model: {model_path}")
        model = YOLO(model_path)
        results = model.val(data=data_yaml_path)

        metrics = {
            "mAP50": float(results.box.map50),
            "mAP50_95": float(results.box.map),
            "precision": float(results.box.mp),
            "recall": float(results.box.mr),
            "fitness": float(results.fitness)
        }

        logger.info(f"Evaluation metrics: {metrics}")

        if log_to_mlflow:
            with mlflow.start_run(nested=True):
                mlflow.log_metrics(metrics)
                mlflow.log_param("evaluation_model", model_path)
                mlflow.log_param("evaluation_data", data_yaml_path)

        return metrics


def train_with_roboflow_mlflow(
    api_key: str | None = None,
    workspace: str | None = None,
    project: str | None = None,
    version: int | None = None,
    model_size: str = "n",
    epochs: int = 100,
    experiment_name: str | None = None
) -> dict[str, Any]:
    logger.info("Starting Roboflow + MLFlow training pipeline")
    trainer = YOLOMLFlowTrainer(experiment_name=experiment_name)

    data_yaml = trainer.setup_roboflow_dataset(
        api_key=api_key,
        workspace=workspace,
        project=project,
        version=version
    )

    return trainer.train_with_mlflow(
        data_yaml_path=data_yaml,
        model_size=model_size,
        epochs=epochs,
        run_name=f"roboflow_{project}_v{version}_{model_size}",
        tags={
            "source": "roboflow",
            "project": project or "unknown",
            "version": str(version or 1)
        }
    )


def prepare_model_for_docker() -> str | None:
    logger.info("Preparing model for Docker deployment")
    trainer = YOLOMLFlowTrainer()
    model_path = trainer.download_model_for_deployment()

    if model_path:
        logger.info(f"Model ready for Docker: {model_path}")
        return model_path
    else:
        logger.error("Failed to prepare model for Docker")
        return None
