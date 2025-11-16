@echo off
chcp 65001 >nul
echo ========================================
echo 系统截图工具
echo ========================================
echo.

cd /d "%~dp0"

echo 检查依赖...
if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo 依赖安装失败！
        pause
        exit /b 1
    )
)

echo.
echo 检查 Chrome 浏览器...
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    echo 检测到系统已安装 Chrome，将使用系统 Chrome
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    echo 检测到系统已安装 Chrome，将使用系统 Chrome
) else (
    echo 未检测到系统 Chrome，将安装 Puppeteer 自带的 Chrome
    echo 提示: 首次运行需要下载 Chrome（约 200MB），请稍候...
    call npx puppeteer browsers install chrome
    if errorlevel 1 (
        echo.
        echo Chrome 浏览器安装失败！
        echo 请手动运行: npx puppeteer browsers install chrome
        pause
        exit /b 1
    )
)
echo Chrome 浏览器已就绪

echo.
echo 开始截图...
echo 提示: 请确保前端服务正在运行 (http://localhost:5175)
echo.

call npm run screenshot

echo.
echo 截图完成！请查看 docs 目录
pause

