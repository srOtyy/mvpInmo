@echo off
title Actualizar CRM

cd /d "%~dp0"

echo =====================================
echo      Actualizando CRM...
echo =====================================
echo.

git pull

if errorlevel 1 (
    echo.
    echo Error: No fue posible actualizar el CRM.(git pull)
    pause
    exit /b
)

echo.
echo Actualizando dependencias...

npm install

if errorlevel 1 (
    echo Error: No fue posible actualizar el CRM.(npm install)
    pause
    exit /b
)

echo.
echo =====================================
echo ✔ CRM actualizado correctamente.
echo =====================================
Presione una tecla para cerrar...
pause