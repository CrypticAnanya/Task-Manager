$root = Split-Path -Parent $PSScriptRoot
$env:DATABASE_URL = "sqlite:///db.sqlite3"
$env:ALLOWED_HOSTS = "localhost,127.0.0.1,testserver"
$env:DEBUG = "True"
$env:CORS_ALLOWED_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"
Set-Location "$root\backend"
& "$root\.venv\Scripts\python.exe" manage.py runserver 127.0.0.1:8000 --noreload
