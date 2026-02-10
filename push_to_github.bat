@echo off
echo ========================================
echo BZ Menu - GitHub Push Script
echo ========================================
echo.

REM Initialize git if not already done
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo.
)

REM Add all files
echo Adding files to Git...
git add .
echo.

REM Commit with timestamp
echo Committing changes...
set timestamp=%date% %time%
git commit -m "Update BZ Menu - %timestamp%"
echo.

REM Set main branch
echo Setting main branch...
git branch -M main
echo.

REM Add remote origin (change URL to your repo)
echo Adding remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/marcelooles764-rgb/sss.git
echo.

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin main --force
echo.

echo ========================================
echo Push completed!
echo Your menu is now available at:
echo https://marcelooles764-rgb.github.io/sss/
echo ========================================
echo.
echo Don't forget to:
echo 1. Enable GitHub Pages in repository settings
echo 2. Set source to 'main' branch
echo 3. Update the URL in zizi.lua
echo.
pause
