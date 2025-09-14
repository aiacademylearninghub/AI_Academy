# Dockerfile
FROM python:3.12-slim

# Install Poetry
RUN pip install --no-cache-dir poetry

WORKDIR /app

# Copy poetry configuration files
COPY pyproject.toml poetry.lock* ./

# Configure poetry to not use a virtual environment in the container
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry install --no-interaction --no-root

# Copy application code
COPY . .

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
