@echo off
title Importar Base de Datos

if not exist "D:\db.json" (
    echo No se encontro la base de datos en el pendrive.
    pause
    exit
)

copy /Y "D:\db.json" "data\db.json"

echo.
echo Base de datos importada correctamente.
pause