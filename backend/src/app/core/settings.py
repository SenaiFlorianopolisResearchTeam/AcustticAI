from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    # Environment configuration
    environment: str = Field(
        default="development", 
        description="Application environment (development, production)"
    )

    db_host: str = Field(default="localhost", description="Database host")
    db_port: int = Field(default=5432, description="Database port")
    db_name: str = Field(default="acousticai", description="Database name")
    db_user: str = Field(default="postgres", description="Database user")
    db_password: str = Field(default="postgres", description="Database password")

    @property
    def database_url(self) -> str:
        return f"postgresql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"

    auth0_domain: str = Field(description="Auth0 domain")
    auth0_client_id: str = Field(description="Auth0 client ID")
    auth0_client_secret: str = Field(description="Auth0 client secret")
    auth0_audience: str = Field(description="Auth0 API audience")
    auth0_algorithms: list[str] = Field(default=["RS256"], description="JWT algorithms")

    jwt_secret_key: str = Field(description="JWT secret key for local tokens")
    jwt_algorithm: str = Field(default="HS256", description="JWT algorithm")
    jwt_expire_minutes: int = Field(default=30, description="JWT token expiration in minutes")

    mlflow_tracking_uri: str = Field(
        default="http://localhost:5000",
        description="MLFlow tracking server URI"
    )
    mlflow_experiment_name: str = Field(
        default="yolo11_acoustic_ai",
        description="Name of the MLFlow experiment"
    )
    mlflow_artifact_location: str = Field(
        default="./mlruns",
        description="MLFlow artifacts storage location"
    )

    roboflow_api_key: str | None = Field(
        default=None,
        description="Roboflow API key for dataset access"
    )
    roboflow_workspace: str | None = Field(
        default=None,
        description="Roboflow workspace name"
    )
    roboflow_project: str | None = Field(
        default=None,
        description="Roboflow project name"
    )
    roboflow_version: int = Field(
        default=1,
        description="Roboflow dataset version"
    )

    model_save_dir: str = Field(
        default="./model",
        description="Directory to save trained models"
    )
    dataset_dir: str = Field(
        default="./dataset",
        description="Directory to store datasets"
    )

    device: str = Field(
        default="auto",
        description="Device to use for training (auto, cpu, cuda, etc.)"
    )
    batch_size: int = Field(
        default=16,
        ge=1,
        le=128,
        description="Training batch size"
    )
    workers: int = Field(
        default=8,
        ge=0,
        le=32,
        description="Number of data loading workers"
    )

    log_level: str = Field(
        default="INFO",
        description="Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)"
    )

    @property
    def model_save_path(self) -> Path:
        return Path(self.model_save_dir)

    @property
    def dataset_path(self) -> Path:
        return Path(self.dataset_dir)

    def validate_roboflow_config(self) -> bool:
        return all([
            self.roboflow_api_key,
            self.roboflow_workspace,
            self.roboflow_project
        ])

    @property
    def is_development(self) -> bool:
        return self.environment.lower() == "development"

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"


settings = Settings()
