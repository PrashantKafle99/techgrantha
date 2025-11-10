# PowerShell script to test admin login endpoint

Write-Host "Testing Admin Login Endpoint" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Test data
$loginData = @{
    email = "admin@techgrantha.com"
    password = "certificate@123"
} | ConvertTo-Json

Write-Host "Sending POST request to http://localhost:3000/api/admin/login" -ForegroundColor Yellow
Write-Host "Email: admin@techgrantha.com" -ForegroundColor Gray
Write-Host "Password: certificate@123" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginData
    
    Write-Host "✅ Login Successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10 | Write-Host
    
    Write-Host ""
    Write-Host "User Details:" -ForegroundColor Cyan
    Write-Host "  Email: $($response.user.email)" -ForegroundColor White
    Write-Host "  Role: $($response.user.role)" -ForegroundColor White
    Write-Host "  ID: $($response.user.id)" -ForegroundColor White
    
    Write-Host ""
    Write-Host "Token (first 50 chars):" -ForegroundColor Cyan
    Write-Host "  $($response.token.Substring(0, [Math]::Min(50, $response.token.Length)))..." -ForegroundColor White
    
} catch {
    Write-Host "❌ Login Failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host ""
        Write-Host "Server Response:" -ForegroundColor Yellow
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Write-Host
    }
}

Write-Host ""
Write-Host "Test complete!" -ForegroundColor Cyan
