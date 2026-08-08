@echo off
REM ============================================================
REM  Wrench ERP-Oficina — GIT PUSH
REM  Commita e envia alteracoes para o GitHub.
REM
REM  Uso:
REM    git-push.bat "mensagem do commit"
REM    git-push.bat                  (mensagem automatica com data)
REM
REM  O remote ja esta configurado com autenticacao (token em .git/config,
REM  arquivo local que nunca e commitado).
REM ============================================================
setlocal enabledelayedexpansion

cd /d "%~dp0"

set MSG=%1
if "%MSG%"=="" (
  for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
  set DATE=!dt:~0,4!-!dt:~4,2!-!dt:~6,2!
  set MSG=update: alteracoes de !DATE!
)

echo.
echo  [Wrench] Adicionando alteracoes...
git add -A

echo  [Wrench] Verificando mudancas...
git diff --cached --stat | findstr /R "file" >nul
if errorlevel 1 (
  git diff --cached --quiet
  if errorlevel 1 goto :commit
  echo  [Wrench] Nenhuma alteracao para commitar.
  goto :end
)

:commit
echo  [Wrench] Commitando: %MSG%
git commit -m "%MSG%"

echo  [Wrench] Enviando para origin/main...
git push origin main

if %errorlevel%==0 (
  echo.
  echo  [Wrench] Push concluido com sucesso.
) else (
  echo.
  echo  [Wrench] ERRO no push. Verifique autenticacao ou conflitos.
  echo  Tente: git pull --rebase origin main ^&^& git push origin main
)

:end
echo.
endlocal
