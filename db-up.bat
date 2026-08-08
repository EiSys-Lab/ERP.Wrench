@echo off
REM ============================================================
REM  Wrench ERP-Oficina — DB UP (PostgreSQL + Redis)
REM  Sobe apenas a infra de banco para desenvolvimento local do backend.
REM  Útil na Fase 4+ quando o backend .NET existir: rode isto e depois
REM  "dotnet run" no backend (porta 5012) + "dev.bat" no frontend.
REM ============================================================
setlocal

cd /d "%~dp0"

echo.
echo  [Wrench] Subindo PostgreSQL 17 + Redis 7...
docker compose up -d postgres redis

echo.
echo  [Wrench] Aguardando saude dos servicos...
timeout /t 3 /nobreak >nul

echo.
echo  [Wrench] Status:
docker compose ps

echo.
echo  PostgreSQL: localhost:5434
echo    DB:     wrench_oficina
echo    User:   wrench
echo    Pass:   wrench
echo  Redis:    localhost:6380
echo.
echo  Conectar via psql:
echo    psql "postgresql://wrench:wrench@localhost:5434/wrench_oficina"
echo.
endlocal
