@echo off
echo ========================================
echo   SimpliPharma - Build Fix Script
echo ========================================
echo.
echo This script will help you build the APK
echo.
echo IMPORTANT: Make sure Metro bundler is 
echo running in ANOTHER terminal window!
echo.
pause

echo.
echo Step 1: Checking EAS CLI installation...
where eas >nul 2>&1
if %errorlevel% neq 0 (
    echo EAS CLI not found. Installing...
    call npm install -g eas-cli
) else (
    echo EAS CLI found!
)

echo.
echo Step 2: Checking login status...
eas whoami
if %errorlevel% neq 0 (
    echo.
    echo You need to login to Expo.
    echo.
    echo If you don't have an account, create one at:
    echo https://expo.dev/signup
    echo.
    pause
    eas login
)

echo.
echo Step 3: Building Android APK...
echo This will take 10-15 minutes...
echo.
echo Build will happen in the cloud.
echo You can close this window after build starts.
echo.
pause

eas build -p android --profile preview

echo.
echo ========================================
echo   Build Started!
echo ========================================
echo.
echo Check build status at:
echo https://expo.dev
echo.
echo Or run: eas build:list
echo.
pause

