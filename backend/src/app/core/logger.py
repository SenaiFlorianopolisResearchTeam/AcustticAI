import logging
import logging.handlers
import os
import sys
from datetime import UTC, datetime
from pathlib import Path


class ColoredFormatter(logging.Formatter):
    """Formatter with colors for development environment."""
    
    COLORS = {
        'DEBUG': '\033[36m',     # Cyan
        'INFO': '\033[32m',      # Green
        'WARNING': '\033[33m',   # Yellow
        'ERROR': '\033[31m',     # Red
        'CRITICAL': '\033[35m',  # Magenta
    }
    RESET = '\033[0m'
    
    def format(self, record):
        timestamp = datetime.fromtimestamp(record.created, tz=UTC).strftime("%Y-%m-%d %H:%M:%S")
        
        # Simplificar nomes de loggers
        logger_name = self._clean_logger_name(record.name)
        
        # Aplicar cor se for ambiente de desenvolvimento
        level_color = self.COLORS.get(record.levelname, '')
        reset_color = self.RESET if level_color else ''
        
        log_message = (
            f"{timestamp} | "
            f"{level_color}[{record.levelname}]{reset_color} | "
            f"{logger_name} | "
            f"{record.getMessage()}"
        )

        if record.exc_info:
            log_message += f"\n{self.formatException(record.exc_info)}"

        return log_message
    
    def _clean_logger_name(self, name: str) -> str:
        """Clean logger names to be more readable."""
        # Mapear nomes específicos
        name_mappings = {
            'uvicorn.error': 'uvicorn',
            'uvicorn.access': 'access',
            'fastapi': 'api',
            'AcousticAI.main': 'main',
            'AcousticAI': 'app',
        }
        
        # Remover prefixos desnecessários
        if name.startswith('AcousticAI.'):
            name = name.replace('AcousticAI.', '')
        
        return name_mappings.get(name, name)


class CleanFormatter(logging.Formatter):
    """Formatter without colors for production environment."""
    
    def format(self, record):
        timestamp = datetime.fromtimestamp(record.created, tz=UTC).strftime("%Y-%m-%d %H:%M:%S")
        
        # Simplificar nomes de loggers
        logger_name = self._clean_logger_name(record.name)
        
        log_message = (
            f"{timestamp} | "
            f"[{record.levelname}] | "
            f"{logger_name} | "
            f"{record.getMessage()}"
        )

        if record.exc_info:
            log_message += f"\n{self.formatException(record.exc_info)}"

        return log_message
    
    def _clean_logger_name(self, name: str) -> str:
        """Clean logger names to be more readable."""
        # Mapear nomes específicos
        name_mappings = {
            'uvicorn.error': 'uvicorn',
            'uvicorn.access': 'access', 
            'fastapi': 'api',
            'AcousticAI.main': 'main',
            'AcousticAI': 'app',
        }
        
        # Remover prefixos desnecessários
        if name.startswith('AcousticAI.'):
            name = name.replace('AcousticAI.', '')
            
        return name_mappings.get(name, name)


class LoggingConfig:
    def __init__(
        self,
        app_name: str = "AcousticAI",
        log_level: str = "DEBUG",
        log_dir: Path | None = None,
        max_file_size: int = 10 * 1024 * 1024,
        backup_count: int = 5,
        *,
        enable_console: bool = True,
        enable_file: bool = True,
        use_colors: bool = None
    ):
        self.app_name = app_name
        self.log_level = getattr(logging, log_level.upper())
        self.log_dir = log_dir or Path("logs")
        self.max_file_size = max_file_size
        self.backup_count = backup_count
        self.enable_console = enable_console
        self.enable_file = enable_file
        
        # Auto-detectar ambiente se não especificado
        if use_colors is None:
            environment = os.getenv("ENVIRONMENT", "development")
            self.use_colors = environment.lower() == "development"
        else:
            self.use_colors = use_colors

        if self.enable_file:
            self.log_dir.mkdir(exist_ok=True)

    def setup_logging(self) -> logging.Logger:
        # Configurar o root logger para capturar TODOS os logs
        root_logger = logging.getLogger()
        root_logger.setLevel(logging.DEBUG)
        
        # Remover handlers existentes
        for handler in root_logger.handlers[:]:
            root_logger.removeHandler(handler)

        # Configurar níveis para loggers específicos
        logging.getLogger("uvicorn").setLevel(self.log_level)
        logging.getLogger("uvicorn.access").setLevel(logging.INFO)
        logging.getLogger("uvicorn.error").setLevel(self.log_level)
        logging.getLogger("fastapi").setLevel(self.log_level)

        # Adicionar handlers ao root logger para capturar tudo
        if self.enable_console:
            console_handler = self._create_console_handler()
            root_logger.addHandler(console_handler)

        if self.enable_file:
            file_handler = self._create_file_handler()
            root_logger.addHandler(file_handler)

            error_handler = self._create_error_handler()
            root_logger.addHandler(error_handler)

        # Retornar o logger da aplicação
        app_logger = logging.getLogger(self.app_name)
        app_logger.setLevel(self.log_level)
        
        return app_logger

    def _create_console_handler(self) -> logging.StreamHandler:
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(self.log_level)

        if self.use_colors:
            formatter = ColoredFormatter()
        else:
            formatter = CleanFormatter()
            
        handler.setFormatter(formatter)
        return handler

    def _create_file_handler(self) -> logging.handlers.RotatingFileHandler:
        log_file = self.log_dir / f"{self.app_name.lower()}.log"

        handler = logging.handlers.RotatingFileHandler(
            filename=log_file,
            maxBytes=self.max_file_size,
            backupCount=self.backup_count,
            encoding="utf-8"
        )
        handler.setLevel(self.log_level)

        formatter = logging.Formatter(
            fmt="%(asctime)s | %(levelname)s | %(name)s | %(funcName)s:%(lineno)d | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        handler.setFormatter(formatter)

        return handler

    def _create_error_handler(self) -> logging.handlers.RotatingFileHandler:
        error_log_file = self.log_dir / f"{self.app_name.lower()}_errors.log"

        handler = logging.handlers.RotatingFileHandler(
            filename=error_log_file,
            maxBytes=self.max_file_size,
            backupCount=self.backup_count,
            encoding="utf-8"
        )
        handler.setLevel(logging.ERROR)

        formatter = logging.Formatter(
            fmt="%(asctime)s | %(levelname)s | %(name)s | %(funcName)s:%(lineno)d | %(message)s\n"
                "%(pathname)s | PID:%(process)d | Thread:%(thread)d\n"
                '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "message": "%(message)s"}\n'
                + "-" * 80,
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        handler.setFormatter(formatter)

        return handler


class _LoggingState:
    def __init__(self):
        self.config: LoggingConfig | None = None
        self.logger: logging.Logger | None = None

    def setup(self, config: LoggingConfig) -> logging.Logger:
        self.config = config
        self.logger = config.setup_logging()
        return self.logger

    def get_logger(self, name: str | None = None) -> logging.Logger:
        if self.logger is None:
            default_config = LoggingConfig()
            self.setup(default_config)

        if name:
            return self.logger.getChild(name)
        return self.logger

_state = _LoggingState()

def setup_logging(
    app_name: str = "AcousticAI",
    log_level: str = "DEBUG",
    log_dir: Path | None = None,
    **kwargs
) -> logging.Logger:
    config = LoggingConfig(
        app_name=app_name,
        log_level=log_level,
        log_dir=log_dir,
        **kwargs
    )

    return _state.setup(config)


def get_logger(name: str | None = None) -> logging.Logger:
    """Get a logger with clean name format."""
    if name:
        return logging.getLogger(name)
    return logging.getLogger("AcousticAI")


def log_function_call(func_name: str, **kwargs):
    logger = get_logger("function_call")
    args_str = ", ".join([f"{k}={v}" for k, v in kwargs.items()])
    logger.debug(f"Calling {func_name}({args_str})")


def log_performance(operation: str, duration: float, **context):
    logger = get_logger("performance")
    context_str = ", ".join([f"{k}={v}" for k, v in context.items()])
    logger.info(f"Performance | {operation} | {duration:.3f}s | {context_str}")


if __name__ != "__main__":
    log_level = os.getenv("LOG_LEVEL", "DEBUG")
    setup_logging(log_level=log_level)


if __name__ == "__main__":
    logger = setup_logging(log_level="DEBUG")

    logger.debug("Mensagem de debug - detalhes técnicos")
    logger.info("Aplicação iniciada com sucesso")
    logger.warning("Aviso: configuração não encontrada, usando padrão")
    logger.error("Erro ao processar dados")
    logger.critical("Erro crítico - sistema pode estar instável")

    api_logger = get_logger("api")
    api_logger.info("Endpoint /health acessado")

    log_performance("model_inference", 0.234, model="acoustic_model", batch_size=32)
