from contextlib import asynccontextmanager

from core.logger import get_logger
from core.settings import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logger = get_logger("main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for FastAPI."""
    logger.info("Starting Acusttic API")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Log level: {settings.log_level}")

    yield

    logger.info("Shutting down Acusttic API")


app = FastAPI(
    title="Acusttic API",
    description="API para detecção acústica com YOLO e Auth0",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Acusttic API is running"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "acusttic-backend",
        "environment": settings.environment,
    }


if __name__ == "__main__":
    from pathlib import Path

    import uvicorn

    backend_dir = Path(__file__).parent.parent.parent
    src_dir = backend_dir / "src"

    reload = settings.is_development

    logger.info(f"Running in {settings.environment} mode with reload={reload}")

    if reload:
        reload_dirs = [
            str(src_dir / "app")
        ]
        logger.info(f"Watching directories: {reload_dirs}")
    else:
        reload_dirs = None

    uvicorn.run(
        "main:app",
        host="0.0.0.0",  # noqa: S104
        port=8000,
        reload=reload,
        reload_dirs=reload_dirs,
        reload_includes=["*.py"] if reload else None,
        log_config=None,
    )
