FROM python:3.12

WORKDIR /src/app

# Instala o uv
RUN pip install uv

# Copia o pyproject.toml e uv.lock primeiro | decidi colocar eles primeiro pois substitui o requirements.txt
COPY pyproject.toml uv.lock ./

# Instala as dependências com o uv
RUN uv pip install -r pyproject.toml --system

COPY . .

CMD ["python", "main.py"]
