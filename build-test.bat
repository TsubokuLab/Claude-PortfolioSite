@echo off
chcp 932 >nul 2>&1
echo =====================================================
echo   Claude Portfolio Site - �r���h�e�X�g�X�N���v�g
echo =====================================================
echo.

:: �J�����g�f�B���N�g�����v���W�F�N�g���[�g�ɐݒ�
cd /d "%~dp0"

echo [INFO] �r���h���J�n���܂�...
echo.

:: �v���_�N�V�����p�r���h
call npm run build

echo.
echo [SUCCESS] �r���h���������܂����B
echo [INFO] �v���r���[�T�[�o�[���N����...
echo [INFO] ��~����ɂ� Ctrl+C �������Ă�������
echo.
echo =====================================================
echo   �J�����ł̃v���r���[���J�n����܂�
echo =====================================================
echo.

:: �v���r���[�T�[�o�[�N���i�u���E�U�����I�[�v���t���j
call npm run preview -- --open

echo.
echo [INFO] �v���r���[�T�[�o�[����~���܂����B
pause