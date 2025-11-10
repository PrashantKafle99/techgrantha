@echo off
echo.
echo === Image Upload Test ===
echo.

echo Step 1: Login and get token...
curl -X POST http://localhost:3000/api/admin/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@techgrantha.com\",\"password\":\"certificate@123\"}" ^
  -o login-response.json

echo.
echo Step 2: Check upload routes...
echo Token saved to login-response.json
echo.
echo To test upload manually, use:
echo curl -X POST http://localhost:3000/api/upload/article-image ^
echo   -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
echo   -F "image=@path/to/your/image.png"
echo.
echo === Test Complete ===
echo.

del login-response.json 2>nul
pause
