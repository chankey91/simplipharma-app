@echo off
echo ========================================
echo   SimpliPharma - Android APK Builder
echo ========================================
echo.

echo Step 1: Checking EAS CLI...
where eas >nul 2>&1
if %errorlevel% neq 0 (
    echo EAS CLI not found. Installing...
    npm install -g eas-cli
)

echo.
echo Step 2: Login to Expo Account...
echo (You'll need to enter your credentials)
echo.
eas login

echo.
echo Step 3: Building Android APK...
echo This will take 10-15 minutes...
echo.
eas build -p android --profile preview

echo.
echo ========================================
echo   Build Complete!
echo ========================================
echo.
echo Download your APK from the link above!
echo.
pause

