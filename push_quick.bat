@echo off
echo ========================================
echo BZ Menu - Quick Push to GitHub
echo ========================================
echo.

cd /d "%~dp0"

REM Initialize git if needed
if not exist ".git" (
    git init
    git branch -M main
)

REM Add all files
git add .

REM Commit
git commit -m "Update BZ Menu - %date% %time%"

REM Set remote
git remote remove origin 2>nul
git remote add origin https://github.com/marcelooles764-rgb/BZ-Menu.git

REM Push
echo Pushing to GitHub...
git push -u origin main --force

echo.
if %errorlevel% equ 0 (
    echo ========================================
    echo SUCCESS! Menu pushed to GitHub
    echo ========================================
    echo.
    echo Your menu is now at:
    echo https://marcelooles764-rgb.github.io/BZ-Menu/
    echo.
    echo Don't forget to enable GitHub Pages:
    echo 1. Go to: https://github.com/marcelooles764-rgb/BZ-Menu/settings/pages
    echo 2. Select "main" branch
    echo 3. Click Save
    echo.
) else (
    echo ========================================
    echo FAILED! Could not push to GitHub
    echo ========================================
    echo.
    echo When prompted for password, use your Personal Access Token
    echo Get it from: https://github.com/settings/tokens
    echo.
)

pause
