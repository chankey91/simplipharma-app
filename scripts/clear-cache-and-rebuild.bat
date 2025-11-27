@echo off
echo Clearing all caches and rebuilding...
echo.

echo Step 1: Clearing node_modules...
if exist node_modules rmdir /s /q node_modules

echo Step 2: Clearing package-lock...
if exist package-lock.json del /f /q package-lock.json

echo Step 3: Clearing npm cache...
call npm cache clean --force

echo Step 4: Clearing Expo cache...
call npx expo start -c

echo Step 5: Clearing EAS cache...
if exist .expo rmdir /s /q .expo

echo Step 6: Installing dependencies...
call npm install

echo.
echo ========================================
echo Cache cleared successfully!
echo Now try building again with:
echo   eas build --platform android --profile preview
echo ========================================
pause

