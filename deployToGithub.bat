@echo off
echo Starting build and deploy process...
echo.

:: �r���h���s
echo Building project...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)
echo Build completed successfully!
echo.

:: Git�R�~�b�g�E�v�b�V��
echo Committing and pushing to main branch...
git add .
git commit -m "Deploy update - %date% %time%"
git push origin main
if %errorlevel% neq 0 (
    echo Git push failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Deployment process completed!
echo Your site will be updated at:
echo https://teruaki-tsubokura.com
echo ========================================
echo.
pause
