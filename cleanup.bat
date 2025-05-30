@echo off
chcp 932 >nul 2>&1
echo =====================================================
echo   Claude Portfolio Site - クリーンアップスクリプト
echo =====================================================
echo.

:: カレントディレクトリをプロジェクトルートに設定
cd /d "%~dp0"

echo [WARNING] このスクリプトは以下を削除します：
echo   - node_modules フォルダ
echo   - dist フォルダ
echo   - package-lock.json ファイル
echo   - Vite のキャッシュ
echo.

set /p confirm="続行しますか？ (y/N): "
if /i not "%confirm%"=="y" (
    echo [INFO] キャンセルされました。
    pause
    exit /b 0
)

echo.
echo [INFO] クリーンアップを開始します...

:: node_modules 削除
if exist "node_modules" (
    echo [INFO] node_modules を削除中...
    rmdir /s /q "node_modules"
    echo [SUCCESS] node_modules を削除しました。
) else (
    echo [INFO] node_modules は存在しません。
)

:: dist 削除
if exist "dist" (
    echo [INFO] dist を削除中...
    rmdir /s /q "dist"
    echo [SUCCESS] dist を削除しました。
) else (
    echo [INFO] dist は存在しません。
)

:: package-lock.json 削除
if exist "package-lock.json" (
    echo [INFO] package-lock.json を削除中...
    del "package-lock.json"
    echo [SUCCESS] package-lock.json を削除しました。
) else (
    echo [INFO] package-lock.json は存在しません。
)

:: Vite キャッシュ削除
if exist ".vite" (
    echo [INFO] .vite キャッシュを削除中...
    rmdir /s /q ".vite"
    echo [SUCCESS] .vite キャッシュを削除しました。
) else (
    echo [INFO] .vite キャッシュは存在しません。
)

echo.
echo [SUCCESS] クリーンアップが完了しました。
echo [INFO] 次に start-dev.bat を実行して依存関係を再インストールしてください。
echo.
pause