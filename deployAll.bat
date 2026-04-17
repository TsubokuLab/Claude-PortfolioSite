@echo off

echo ========================================
echo   Deploy All
echo   1. Push to Main
echo   2. Deploy to GitHub Pages / Server
echo ========================================
echo.

rem --- Step 1: Push to main branch (only if changes exist) ---
echo [1/2] Pushing to main branch...
echo.

git add .
git diff --staged --quiet
if %errorlevel% neq 0 (
    git commit -m "update contents"
    git push origin main
    echo [OK] Pushed to main.
) else (
    echo [SKIP] No changes to commit.
)

echo.

rem --- Step 2: Build and deploy to gh-pages (triggers server webhook) ---
echo [2/2] Building and deploying to GitHub Pages...
echo.

call npm run deploy
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Deploy failed!
    goto end
)

echo.
echo ========================================
echo [SUCCESS] All done!
echo.
echo   GitHub Pages : https://tsubokulab.github.io/Claude-PortfolioSite/
echo   Production   : https://teruaki-tsubokura.com
echo.
echo   * Server update may take a few seconds.
echo ========================================

:end
echo.
pause
