@echo off
echo Deploying to GitHub Pages (Demo)...
echo.

call npm run deploy:github
if %errorlevel% neq 0 (
    echo GitHub Pages deploy failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo GitHub Pages deployment completed!
echo Demo site: https://tsubokulab.github.io/Claude-PortfolioSite/
echo ========================================
echo.
pause
