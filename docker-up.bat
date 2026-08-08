@echo off
REM ============================================================
REM  Wrench ERP-Oficina — DOCKER UP (producao containerizada)
REM  Builda e sobe o frontend em container Docker.
REM  Opcional: sobe também postgres + redis (para o backend futuro).
REM
REM  Uso:
REM    docker-up.bat            -> só frontend
REM    docker-up.bat all        -> frontend + postgres + redis
REM    docker-up.bat db         -> só postgres + redis
REM ============================================================
setlocal

cd /d "%~dp0"
set MODE=%1

if /i "%MODE%"=="all" (
  echo.
  echo  [Wrench] Subindo frontend + postgres + redis...
  docker compose up -d --build
  goto :show
)

if /i "%MODE%"=="db" (
  echo.
  echo  [Wrench] Subindo postgres + redis (sem frontend)...
  docker compose up -d --build postgres redis
  goto :show
)

REM Default: só frontend
echo.
echo  [Wrench] Subindo apenas o frontend...
echo  (use "docker-up.bat all" para incluir postgres + redis)
docker compose up -d --build frontend

:show
echo.
echo  [Wrench] Containers em execucao:
docker compose ps
echo.
echo  Frontend: http://localhost:3000
echo  Postgres: localhost:5434 (user wrench / pass wrench / db wrench_oficina)
echo  Redis:    localhost:6380
echo.
endlocal
