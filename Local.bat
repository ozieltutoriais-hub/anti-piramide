@echo off
title AUTO ESCOLA ONLINE

cd /d "%USERPROFILE%\Desktop\anti-piramide"

start cmd /k "npm run dev"

timeout /t 5 >nul

start http://localhost:5173