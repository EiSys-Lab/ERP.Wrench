@echo off
REM ============================================================
REM  Wrench ERP-Oficina — DEV LOCAL (bun dev)
REM  Sobe o frontend em modo desenvolvimento com hot-reload.
REM  Requer: Node.js 20+, bun (ou npm como fallback).
REM ============================================================
setlocal

cd /d "%~dp0src\frontend"

echo.
echo  [Wrench] Iniciando frontend em modo dev...
echo  URL: http://localhost:3000
echo.

REM Verifica dependências instaladas.
if not exist "node_modules" (
  echo  [Wrench] node_modules ausente. Instalando dependencias...
  where bun >nul 2>nul
  if %errorlevel%==0 (
    call bun install
  ) else (
    call npm install
  )
)

where bun >nul 2>nul
if %errorlevel%==0 (
  call bun dev
) else (
  call npm run dev
)

endlocal
