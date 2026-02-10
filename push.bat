@echo off
chcp 65001 >nul
echo ========================================
echo BZ Menu - Push to GitHub
echo ========================================
echo.

echo Adding files...
git add .

echo.
echo Committing changes...
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c/%%b/%%a)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a:%%b)
git commit -m "Update BZ Menu - %mydate% %mytime%"

echo.
echo Setting main branch...
git branch -M main

echo.
echo Adding remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/Sakel21/Bouns.git

echo.
echo Pushing to GitHub...
git push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! Menu pushed to GitHub
    echo ========================================
    echo.
    echo Your menu will be available at:
    echo https://sakel21.github.io/Bouns/
    echo.
    echo Next steps:
    echo 1. Go to: https://github.com/Sakel21/Bouns/settings/pages
    echo 2. Under "Source", select "main" branch
    echo 3. Click "Save"
    echo 4. Wait 1-2 minutes for deployment
    echo.
    echo Menu URL: https://sakel21.github.io/Bouns/
    echo.
) else (
    echo.
    echo ========================================
    echo FAILED! Could not push to GitHub
    echo ========================================
    echo.
    echo When prompted for password, use your Personal Access Token
    echo Get it from: https://github.com/settings/tokens
    echo.
)

pause
