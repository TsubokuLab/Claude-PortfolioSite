@echo off
echo Testing gh-pages deployment setup...
echo.

:: Check if git is configured
echo Checking git configuration...
git config --global user.name
git config --global user.email
echo.

:: Check if we're in a git repository
echo Checking git repository status...
git status
echo.

:: Check if gh-pages package is available
echo Checking gh-pages package...
npm list gh-pages
echo.

:: Test build command
echo Testing build command...
call npm run build:github
if %errorlevel% neq 0 (
    echo Build failed! Please fix build errors first.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup test completed successfully!
echo You can now run deployToGithubPages.bat
echo ========================================
echo.
pause
