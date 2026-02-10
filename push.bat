@echo off
echo ========================================
echo BZ Menu - Push to GitHub
echo ========================================
echo.

cd /d "%~dp0"

REM Initialize git if needed
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo.
)

REM Add all files
echo Adding files...
git add .
echo.

REM Commit
echo Committing changes...
git commit -m "Update BZ Menu - %date% %time%"
echo.

REM Set main branch
echo Setting main branch...
git branch -M main
echo.

REM Add remote
echo Adding remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/Sakel21/BZ-Menu.git
echo.

REM Push
echo Pushing to GitHub...
git push -u origin main
echo.

if %errorlevel% equ 0 (
    echo ========================================
    echo SUCCESS! Menu pushed to GitHub
    echo ========================================
    echo.
    echo Your menu will be available at:
    echo https://sakel21.github.io/BZ-Menu/
    echo.
    echo Next steps:
    echo 1. Go to: https://github.com/Sakel21/BZ-Menu/settings/pages
    echo 2. Under "Source", select "main" branch
    echo 3. Click "Save"
    echo 4. Wait 1-2 minutes for deployment
    echo.
    echo Then update zizi.lua with:
    echo https://sakel21.github.io/BZ-Menu/
    echo.
) else (
    echo ========================================
    echo Push completed with warnings
    echo ========================================
    echo.
    echo If this is your first push, the menu should be on GitHub now.
    echo Check: https://github.com/Sakel21/BZ-Menu
    echo.
)

pause
