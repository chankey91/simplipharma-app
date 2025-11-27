@echo off
echo ========================================
echo   Move SimpliPharma Out of OneDrive
echo ========================================
echo.
echo OneDrive sync is likely causing the
echo permission denied errors!
echo.
echo This will copy your project to C:\SimpliPharma
echo (outside OneDrive)
echo.
pause

echo.
echo [1/4] Creating C:\SimpliPharma directory...
if not exist "C:\SimpliPharma" (
    mkdir "C:\SimpliPharma"
    echo ✓ Created
) else (
    echo ℹ Already exists
)

echo.
echo [2/4] Copying project files...
echo This may take a minute...
xcopy "%~dp0*" "C:\SimpliPharma\" /E /I /H /Y
if %errorlevel%==0 (
    echo ✓ Files copied successfully
) else (
    echo ❌ Copy failed
    pause
    exit /b 1
)

echo.
echo [3/4] Opening new location...
cd /d C:\SimpliPharma

echo.
echo [4/4] Installing dependencies...
call npm install

echo.
echo ========================================
echo   Move Complete!
echo ========================================
echo.
echo Your project is now at: C:\SimpliPharma
echo.
echo Next steps:
echo 1. Open NEW Command Prompt
echo 2. cd C:\SimpliPharma
echo 3. eas login
echo 4. eas build -p android --profile preview --clear-cache
echo.
echo Build should work now! (outside OneDrive)
echo.
pause

:: Open new command prompt at the new location
start cmd /k "cd /d C:\SimpliPharma && echo Ready to build! Run: eas build -p android --profile preview --clear-cache"

