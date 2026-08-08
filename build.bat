@echo off
REM ============================================================
REM  Wrench ERP-Oficina — BUILD (producao local, sem Docker)
REM  Gera o build otimizado do Next.js em .next/
REM ============================================================
setlocal

cd /d "%~dp0src\frontend"

echo.
echo  [Wrench] Build de producao do frontend...

where bun >nul 2>nul
if %errorlevel%==0 (
  call bun run build
) else (
  call npm run build
)

if %errorlevel%==0 (
  echo.
  echo  [Wrench] Build concluido com sucesso. Saida em .next/
) else (
  echo.
  echo  [Wrench] ERRO no build. Verifique as mensagens acima.
)

endlocal
