@echo off
chcp 65001 >nul
echo ========================================
echo   茯忆长安网页 - Vercel 部署助手
echo ========================================
echo.

REM 检查 Git 是否安装
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到 Git，请先安装 Git
    echo 下载地址：https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [✓] Git 已安装
echo.

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [警告] 未检测到 Node.js
    echo 建议使用方式一（GitHub 官网部署）
    echo 下载地址：https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [✓] Node.js 已安装
echo.

REM 检查 Vercel CLI 是否安装
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [信息] Vercel CLI 未安装，正在安装...
    echo.
    call npm install -g vercel
    if %ERRORLEVEL% NEQ 0 (
        echo [错误] Vercel CLI 安装失败
        echo 请手动运行：npm install -g vercel
        echo.
        pause
        exit /b 1
    )
)

echo [✓] Vercel CLI 已安装
echo.
echo ========================================
echo   开始部署到 Vercel
echo ========================================
echo.

REM 检查是否已登录
vercel whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [信息] 未登录 Vercel，正在引导登录...
    echo 请在打开的浏览器窗口中完成登录
    echo.
    vercel login
)

echo.
echo [✓] 已登录 Vercel
echo.
echo 正在部署项目...
echo.

REM 执行部署
vercel --prod

echo.
echo ========================================
echo   部署完成！
echo ========================================
echo.
echo 请查看上方的部署链接
echo 通常格式为：https://your-project.vercel.app
echo.
pause
