@echo off
echo Installing dependencies...
call npm install
echo Starting CSV Cleaner on http://localhost:3000
call npm run dev
pause
