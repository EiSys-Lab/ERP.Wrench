@echo off
REM ============================================================
REM  Wrench ERP-Oficina — INSTALL DEPENDENCIAS
REM  Instala as dependências do frontend (node_modules).
REM ============================================================
setlocal

cd /d "%~dp0src\frontend"

echo.
echo  [Wrench] Instalando dependencias do frontend...

where bun >nul 2>nul
if %errorlevel%==0 (
  echo  Usando bun...
  call bun install
) else (
  echo  bun nao encontrado. Usando npm...
  echo  (Recomendado: instale bun em https://bun.sh)
  call npm install
)

echo.
echo  [Wrench] Dependencias instaladas. Rode "dev.bat" para iniciar.
endlocal
