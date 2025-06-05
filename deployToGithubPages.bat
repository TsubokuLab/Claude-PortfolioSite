@echo off
echo Deploying to GitHub Pages...
echo.

call npm run deploy
if %errorlevel% neq 0 (
    echo Deploy failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo GitHub Pages deployment completed!
echo Demo site: https://tsubokulab.github.io/Claude-PortfolioSite/
echo.
echo Note: It may take a few minutes for changes to appear.
echo ========================================
echo.
pause
