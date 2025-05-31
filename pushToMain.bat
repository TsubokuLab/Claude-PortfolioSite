@echo off
echo ========================================
echo   Push to Main Branch
echo ========================================
echo.

cd /d "%~dp0"
echo Current directory: %cd%
echo.

echo [STEP 1] Checking current branch and status...
git branch --show-current
echo.

echo Current git status:
git status --short
echo.

echo [STEP 2] Adding all changes...
git add .
echo All changes added to staging area.
echo.

echo [STEP 3] Checking if there are changes to commit...
git diff --staged --quiet
if %errorlevel% neq 0 (
    echo Changes detected. Proceeding with commit...
    
    echo.
    set /p commit_message="Enter commit message (or press Enter for default): "
    if "%commit_message%"=="" (
        set "commit_message=Update - %date% %time%"
    )
    
    echo [STEP 4] Committing changes...
    git commit -m "%commit_message%"
    if %errorlevel% neq 0 (
        echo [ERROR] Commit failed!
        pause
        exit /b 1
    )
    echo Commit successful!
    echo.
    
    echo [STEP 5] Pushing to main branch...
    git push origin main
    if %errorlevel% neq 0 (
        echo [ERROR] Push failed!
        pause
        exit /b 1
    )
    
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
