@echo off
setlocal

echo Installing dependencies for the project...

node -v >nul 2>&1
IF ERRORLEVEL 1 (
    echo Node.js is not installed. Please install it from https://nodejs.org/ and try again.
    pause
    exit /b 1
)

echo Installing production dependencies...
npm install --omit=dev
IF ERRORLEVEL 1 (
    echo Failed to install production dependencies.
    pause
    exit /b 1
)

echo Installing development dependencies...
npm install --only=dev
IF ERRORLEVEL 1 (
    echo Failed to install development dependencies.
    pause
    exit /b 1
)

echo.
echo All dependencies have been installed successfully.

pause
