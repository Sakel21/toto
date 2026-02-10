@echo off
echo ========================================
echo BZ Menu - GitHub Push Script
echo ========================================
echo.

REM Ask for GitHub username
set /p github_user="Enter your GitHub username (e.g., Sakel21): "
echo.

REM Ask for repository name
set /p repo_name="Enter repository name (e.g., bzmenu): "
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

REM Add remote origin
echo Adding remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/%github_user%/%repo_name%.git
echo.

echo ========================================
echo IMPORTANT: Authentication Required
echo ========================================
echo.
echo GitHub now requires a Personal Access Token (PAT) instead of password.
echo.
echo If you don't have a token yet:
echo 1. Go to: https://github.com/settings/tokens
echo 2. Click "Generate new token" (classic)
echo 3. Give it a name (e.g., "BZ Menu")
echo 4. Select scope: "repo" (full control)
echo 5. Click "Generate token"
echo 6. Copy the token (you won't see it again!)
echo.
echo When prompted for password, paste your token instead.
echo.
pause

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin main
echo.

if %errorlevel% equ 0 (
    echo ========================================
    echo Push completed successfully!
    echo ========================================
    echo.
    echo Your menu will be available at:
    echo https://%github_user%.github.io/%repo_name%/
    echo.
    echo Next steps:
    echo 1. Go to: https://github.com/%github_user%/%repo_name%/settings/pages
    echo 2. Under "Source", select "main" branch
    echo 3. Click "Save"
    echo 4. Wait 1-2 minutes for deployment
    echo 5. Update zizi.lua with the URL above
    echo.
) else (
    echo ========================================
    echo Push failed!
    echo ========================================
    echo.
    echo Common issues:
    echo - Wrong username or repository name
    echo - Repository doesn't exist (create it first on GitHub)
    echo - Authentication failed (use Personal Access Token)
    echo - No permission (check repository ownership)
    echo.
)

pause
