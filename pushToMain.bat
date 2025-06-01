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
    git commit -m "push from bat"
    git push origin main

    echo.
    echo ========================================
    echo [SUCCESS] Push to main branch completed!
    echo.
    echo Commit message: %commit_message%
    echo.
    echo This will trigger:
    echo - GitHub Actions workflow
    echo - Automatic deployment to production
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
