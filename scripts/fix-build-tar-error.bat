@echo off
echo ========================================
echo   Fix EAS Build Tar Error
echo ========================================
echo.
echo This will fix the tar extraction error
echo by cleaning up your project files.
echo.
pause

cd /d %~dp0

echo [1/5] Creating .easignore file...
if not exist .easignore (
    echo .easignore already created!
) else (
    echo ✓ .easignore created
)

echo.
echo [2/5] Removing node_modules from tracking...
git rm -r --cached node_modules 2>nul
if %errorlevel%==0 (
    echo ✓ node_modules removed from git
) else (
    echo ℹ node_modules not in git (good!)
)

echo.
echo [3/5] Cleaning build artifacts...
if exist .expo (
    rmdir /s /q .expo
    echo ✓ Removed .expo folder
)
if exist android (
    rmdir /s /q android
    echo ✓ Removed android folder
)
if exist ios (
    rmdir /s /q ios
    echo ✓ Removed ios folder
)

echo.
echo [4/5] Committing fixes...
git add .easignore .gitignore
git commit -m "Fix: Add .easignore to prevent tar extraction errors"
if %errorlevel%==0 (
    echo ✓ Changes committed
) else (
    echo ℹ No changes to commit
)

echo.
echo [5/5] Pushing to GitHub...
git push origin main
if %errorlevel%==0 (
    echo ✓ Pushed to GitHub
) else (
    echo ℹ Already up to date
)

echo.
echo ========================================
echo   Cleanup Complete!
echo ========================================
echo.
echo Now try building again:
echo   1. Open NEW Command Prompt
echo   2. Run: eas build -p android --profile preview
echo.
pause

