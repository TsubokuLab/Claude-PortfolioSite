@echo off
chcp 932 >nul 2>&1
echo =====================================================
echo   Claude Portfolio Site - �J�����N���X�N���v�g
echo =====================================================
echo.
:: �J�����g�f�B���N�g�����v���W�F�N�g���[�g�ɐݒ�
cd /d "%~dp0"

:: �J���T�[�o�[�̋N��
echo [INFO] Vite�J���T�[�o�[���N����...
echo [INFO] �T�[�o�[���N�������玩���I�Ƀu���E�U���J���܂�
echo [INFO] ��~����ɂ� Ctrl+C �������Ă�������
echo.
echo =====================================================
echo   http://localhost:5173 �ŃA�N�Z�X�\�ɂȂ�܂�
echo =====================================================
echo.

:: �J���T�[�o�[�N���i�u���E�U�����I�[�v���t���j
call npm run dev -- --open
pause

echo.
echo [INFO] �J���T�[�o�[����~���܂����B
pause