@echo off
echo Starting direct production deployment...
echo.

echo Building project...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)
echo Build completed successfully!
echo.


for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo Current branch: %CURRENT_BRANCH%
echo.


echo Preparing production branch...
git fetch origin


git rev-parse --verify origin/production >nul 2>&1
if %errorlevel% neq 0 (
    echo Creating new production branch...
    git checkout --orphan production
) else (
    echo Switching to production branch...
    git checkout -B production origin/production
)


echo Deploying built files...
git rm -rf . 2>nul
xcopy /E /I /Y dist\* .
git add .


git diff --staged --quiet
if %errorlevel% neq 0 (
    git commit -m "Production deploy - %date% %time%"
    git push -f origin production
    if %errorlevel% neq 0 (
        echo Production push failed!
        git checkout %CURRENT_BRANCH%
        pause
        exit /b 1
    )
    echo Production push completed!
) else (
    echo No changes to deploy.
)


echo Returning to %CURRENT_BRANCH% branch...
git checkout %CURRENT_BRANCH%

echo.
echo ========================================
echo Direct production deployment completed!
echo Your site will be updated at:
echo https://teruaki-tsubokura.com
echo ========================================
echo.
pause
