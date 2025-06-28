Write-Host "Starting AI Academy Server..."
$projectDir = $PSScriptRoot
Set-Location $projectDir
.\.venv\Scripts\activate.ps1
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
