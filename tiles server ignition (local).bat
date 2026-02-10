@echo off
title PG_Tileserv Kostanay
echo Starting PostGIS Vector Tile Server...

:: 1. Переходим в папку с программой
cd /d "C:\Users\user\Downloads\pg_tileserv_latest_windows"

:: 2. Устанавливаем соединение с базой данных
set DATABASE_URL=postgresql://postgres:14Az85@localhost:5432/kostanay_db

:: 3. Запускаем сервер
pg_tileserv.exe

:: Если сервер упадет, окно не закроется сразу
pause