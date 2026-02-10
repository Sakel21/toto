@echo off
echo ========================================
echo BZ Menu - GitHub Push Script
echo ========================================
echo.

REM Check if config exists
if not exist ".github_config" (
    echo Configuration not found!
    echo Please run setup_github.bat first.
    echo.
    pause
    exit /b 1
)

REM Read configuration
set /p github_user=<.github_config
for /f "skip=1 tokens=*" %%a in (.github_config) do (
    if not defined repo_name (
        set repo_name=%%a
    ) else if not defined github_token (
        set github_token=%%a
    )
)

echo Using GitHub account: %github_user%
echo Repository: %repo_name%
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

REM Add remote origin with token
echo Adding remote origin...
git remote remove origin 2>nul
git remote add origin https://%github_token%@github.com/%github_user%/%repo_name%.git
echo.

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin main --force
echo.

if %errorlevel% equ 0 (
    echo ========================================
    echo Push completed successfully!
    echo ========================================
    echo.
    echo Your menu is available at:
    echo https://%github_user%.github.io/%repo_name%/
    echo.
    echo Next steps:
    echo 1. Go to: https://github.com/%github_user%/%repo_name%/settings/pages
    echo 2. Under "Source", select "main" branch
    echo 3. Click "Save"
    echo 4. Wait 1-2 minutes for deployment
    echo.
    echo Update zizi.lua with this URL:
    echo https://%github_user%.github.io/%repo_name%/
    echo.
) else (
    echo ========================================
    echo Push failed!
    echo ========================================
    echo.
    echo Please check:
    echo - Repository exists on GitHub
    echo - Token has correct permissions
    echo - Internet connection is working
    echo.
)

pause
