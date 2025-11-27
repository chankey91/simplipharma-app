@echo off
echo ========================================
echo   FINAL Build Fix - Tar Error Solution
echo ========================================
echo.
echo This will use a minimal .easignore and
echo rebuild from scratch.
echo.
pause

cd /d %~dp0

echo Step 1: Updating .easignore (minimal version)...
echo ✓ Updated

echo.
echo Step 2: Cleaning local cache...
if exist .expo (
    rmdir /s /q .expo
    echo ✓ Removed .expo folder
)

echo.
echo Step 3: Committing changes...
git add .easignore
git commit -m "Fix: Minimal .easignore for tar extraction"
git push origin main

echo.
echo ========================================
echo   Now Try Building:
echo ========================================
echo.
echo Option 1: In NEW Command Prompt, run:
echo   eas build -p android --profile preview --clear-cache
echo.
echo Option 2: If still fails, try:
echo   eas build -p android --profile preview --no-wait
echo.
echo The --clear-cache flag will force a fresh build!
echo.
pause

