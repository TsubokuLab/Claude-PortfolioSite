@echo off
echo ========================================
echo   Push to Main Branch
echo ========================================
echo.

git branch --show-current
git status --short
git add .

git diff --staged --quiet
if %errorlevel% neq 0 (
    git commit -m "push from .bat"
    git push origin main

    echo.
    echo ========================================
    echo [SUCCESS] Push to main branch completed!
    echo.
    echo NOTE: This does NOT publish anything.
    echo   main is the source branch only.
    echo   To publish, run deployToGithubPages.bat
    echo   ^(gh-pages push triggers the server webhook^)
    echo ========================================
) else (
    echo No changes to commit.
    echo Working directory is clean.
    echo.
    echo ========================================
    echo [INFO] Nothing to push
    echo ========================================
)

echo.
pause
