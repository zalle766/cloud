@echo off
echo Adding files to git...
git add vercel.json
git add frontend
echo.
echo Committing changes...
git commit -m "Fix Vercel build configuration - update vercel.json"
echo.
echo Pushing to GitHub...
git push origin main
echo.
echo Done!
pause



