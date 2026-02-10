@echo off
echo ========================================
echo BZ Menu - GitHub Setup (One-time)
echo ========================================
echo.

REM Ask for GitHub credentials
set /p github_user="Enter your GitHub username: "
set /p repo_name="Enter repository name: "
set /p github_token="Enter your Personal Access Token: "
echo.

REM Save credentials to config file (this file should NOT be pushed to GitHub)
echo %github_user%> .github_config
echo %repo_name%>> .github_config
echo %github_token%>> .github_config

echo Configuration saved!
echo.
echo You can now use push_to_github.bat to push updates.
echo.
echo IMPORTANT: The .github_config file contains your token.
echo Do NOT share this file or push it to GitHub!
echo.
pause
