@echo off
chcp 932 >nul 2>&1
echo =====================================================
echo   Claude Portfolio Site - ビルドテストスクリプト
echo =====================================================
echo.

:: カレントディレクトリをプロジェクトルートに設定
cd /d "%~dp0"

echo [INFO] ビルドを開始します...
echo.

:: プロダクション用ビルド
call npm run build

echo.
echo [SUCCESS] ビルドが完了しました。
echo [INFO] プレビューサーバーを起動中...
echo [INFO] 停止するには Ctrl+C を押してください
echo.
echo =====================================================
echo   開発環境でのプレビューが開始されます
echo =====================================================
echo.

:: プレビューサーバー起動（ブラウザ自動オープン付き）
call npm run preview -- --open

echo.
echo [INFO] プレビューサーバーが停止しました。
pause