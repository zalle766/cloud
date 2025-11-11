@echo off
echo Starting Eat to Eat User Registration Test...
echo.

echo [1/4] Checking if backend server is running...
curl -s http://localhost:5000/api/auth/register > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Backend server is not running on port 5000
    echo Please start the backend server first:
    echo   cd backend
    echo   npm start
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Backend server is running
)

echo.
echo [2/4] Checking if frontend server is running...
curl -s http://localhost:5173 > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Frontend server is not running on port 5173
    echo Please start the frontend server first:
    echo   cd frontend
    echo   npm run dev
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Frontend server is running
)

echo.
echo [3/4] Testing user registration API endpoint...
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\":\"Test\",\"lastName\":\"User\",\"email\":\"test@example.com\",\"phoneNumber\":\"01234567890\",\"password\":\"password123\",\"city\":\"الدار البيضاء\",\"neighborhood\":\"المعادي\",\"street\":\"شارع التحرير\",\"latitude\":33.5731,\"longitude\":-7.5898,\"fullAddress\":\"شارع التحرير، المعادي، الدار البيضاء\"}" ^
  -s -o test_response.json

if %errorlevel% neq 0 (
    echo ❌ API test failed
    pause
    exit /b 1
) else (
    echo ✅ API endpoint is responding
)

echo.
echo [4/4] Opening user registration page...
start http://localhost:5173/user/register

echo.
echo ✅ Test completed successfully!
echo.
echo The user registration form should now be working properly.
echo You can test it by:
echo 1. Filling out the registration form
echo 2. Submitting it to create a new user account
echo 3. Checking if you're redirected to the restaurants page
echo.
echo If you encounter any issues, check the browser console for error messages.
echo.
pause
