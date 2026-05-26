@echo off
title Deploy Auto Escola Online

echo ================================
echo ENVIANDO PARA GITHUB E VERCEL
echo ================================

git add .

git commit -m "deploy automatico"

git push

echo.
echo ================================
echo DEPLOY ENVIADO!
echo ================================
echo Aguarde a Vercel atualizar...
echo.

pause