@echo off
echo Starting AI Academy Server...
cd /d %~dp0
call .venv\Scripts\activate.bat
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
