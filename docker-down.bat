@echo off
REM ============================================================
REM  Wrench ERP-Oficina — DOCKER DOWN
REM  Para e remove os containers (volumes são preservados).
REM
REM  Uso:
REM    docker-down.bat           -> para e remove containers
REM    docker-down.bat purge     -> para, remove containers E volumes (apaga dados do banco)
REM ============================================================
setlocal

cd /d "%~dp0"
set MODE=%1

if /i "%MODE%"=="purge" (
  echo.
  echo  [Wrench] ATENCAO: removendo containers E volumes (dados do banco serao apagados)...
  docker compose down -v
  goto :end
)

echo.
echo  [Wrench] Parando e removendo containers (volumes preservados)...
docker compose down

:end
echo.
echo  [Wrench] Concluido.
endlocal
