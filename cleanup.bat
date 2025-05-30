@echo off
chcp 932 >nul 2>&1
echo =====================================================
echo   Claude Portfolio Site - �N���[���A�b�v�X�N���v�g
echo =====================================================
echo.

:: �J�����g�f�B���N�g�����v���W�F�N�g���[�g�ɐݒ�
cd /d "%~dp0"

echo [WARNING] ���̃X�N���v�g�͈ȉ����폜���܂��F
echo   - node_modules �t�H���_
echo   - dist �t�H���_
echo   - package-lock.json �t�@�C��
echo   - Vite �̃L���b�V��
echo.

set /p confirm="���s���܂����H (y/N): "
if /i not "%confirm%"=="y" (
    echo [INFO] �L�����Z������܂����B
    pause
    exit /b 0
)

echo.
echo [INFO] �N���[���A�b�v���J�n���܂�...

:: node_modules �폜
if exist "node_modules" (
    echo [INFO] node_modules ���폜��...
    rmdir /s /q "node_modules"
    echo [SUCCESS] node_modules ���폜���܂����B
) else (
    echo [INFO] node_modules �͑��݂��܂���B
)

:: dist �폜
if exist "dist" (
    echo [INFO] dist ���폜��...
    rmdir /s /q "dist"
    echo [SUCCESS] dist ���폜���܂����B
) else (
    echo [INFO] dist �͑��݂��܂���B
)

:: package-lock.json �폜
if exist "package-lock.json" (
    echo [INFO] package-lock.json ���폜��...
    del "package-lock.json"
    echo [SUCCESS] package-lock.json ���폜���܂����B
) else (
    echo [INFO] package-lock.json �͑��݂��܂���B
)

:: Vite �L���b�V���폜
if exist ".vite" (
    echo [INFO] .vite �L���b�V�����폜��...
    rmdir /s /q ".vite"
    echo [SUCCESS] .vite �L���b�V�����폜���܂����B
) else (
    echo [INFO] .vite �L���b�V���͑��݂��܂���B
)

echo.
echo [SUCCESS] �N���[���A�b�v���������܂����B
echo [INFO] ���� start-dev.bat �����s���Ĉˑ��֌W���ăC���X�g�[�����Ă��������B
echo.
pause