@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: ============================================
:: 图片识别工具 — 基于 MiniMax Vision
:: 用法:
::   describe.bat photo.jpg               描述图片内容
::   describe.bat photo.jpg "这是什么?"    针对图片提问
::   直接拖拽图片到此文件上即可
:: ============================================

if "%~1"=="" (
    echo 用法: describe.bat 图片路径 ["问题"]
    echo 支持: jpg / png / webp / gif
    exit /b 1
)

set IMAGE=%~1
set PROMPT=%~2
if "%PROMPT%"=="" set PROMPT=请详细描述这张图片的内容，包括文字、布局、元素和交互状态。

echo.
echo 📷 正在分析: %~nx1
echo ⏳ 请稍候...
echo.

mmx vision describe --image "%IMAGE%" --prompt "%PROMPT%" --quiet 2>&1

if errorlevel 1 (
    echo.
    echo ❌ 识别失败，请检查:
    echo   1. API Key 是否有效: mmx auth login --api-key sk-你的key
    echo   2. 图片路径是否正确
    echo   3. 图片格式是否支持 (jpg/png/webp/gif)
)
