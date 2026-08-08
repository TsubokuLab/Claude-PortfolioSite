@echo off

echo ========================================
echo   Deploy All
echo   1. Push source to main (backup only)
echo   2. Build and push to gh-pages
echo      -^> GitHub Pages + production server
echo ========================================
echo.

rem --- Step 1: Push source to main (backup only; does not publish) ---
rem     No GitHub Actions workflow is configured, so pushing to main
rem     has no side effects. Publishing happens in step 2.
echo [1/2] Pushing source to main branch...
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
