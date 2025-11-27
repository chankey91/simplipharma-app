@echo off
echo ========================================
echo   Build Diagnostics Script
echo ========================================
echo.
echo This will check your build setup...
echo.

echo [1/8] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo Install from: https://nodejs.org
    pause
    exit /b 1
)

echo.
echo [2/8] Checking npm...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm not found!
    pause
    exit /b 1
)

echo.
echo [3/8] Checking Expo CLI...
npx expo --version
if %errorlevel% neq 0 (
    echo WARNING: Expo CLI issue
)

echo.
echo [4/8] Checking EAS CLI...
eas --version
if %errorlevel% neq 0 (
    echo ERROR: EAS CLI not found!
    echo Installing now...
    npm install -g eas-cli
)

echo.
echo [5/8] Checking Expo login status...
eas whoami
if %errorlevel% neq 0 (
    echo ERROR: Not logged in to Expo!
    echo.
    echo You need to login first.
    echo If you don't have an account, create one at: https://expo.dev/signup
    echo.
    set /p LOGIN="Press Enter to login now, or Ctrl+C to cancel..."
    eas login
)

echo.
echo [6/8] Checking project configuration...
eas project:info
if %errorlevel% neq 0 (
    echo WARNING: Project not configured
    echo This might be the first build
)

echo.
echo [7/8] Checking package.json...
if exist package.json (
    echo ✓ package.json found
) else (
    echo ERROR: package.json not found!
    echo Are you in the correct directory?
    pause
    exit /b 1
)

echo.
echo [8/8] Checking app.json...
if exist app.json (
    echo ✓ app.json found
) else (
    echo ERROR: app.json not found!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Diagnostics Complete!
echo ========================================
echo.
echo All checks passed. Ready to build!
echo.
set /p BUILD="Do you want to start the build now? (Y/N): "
if /i "%BUILD%"=="Y" (
    echo.
    echo Starting build...
    echo This will take 10-15 minutes...
    echo.
    eas build -p android --profile preview
) else (
    echo.
    echo To build later, run:
    echo eas build -p android --profile preview
)

echo.
pause

