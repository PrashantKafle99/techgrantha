@echo off
echo Testing Admin Login Endpoint
echo ============================
echo.

curl -X POST http://localhost:3000/api/admin/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@techgrantha.com\",\"password\":\"certificate@123\"}"

echo.
echo.
echo Test complete!
pause
