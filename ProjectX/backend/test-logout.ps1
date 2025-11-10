# PowerShell script to test admin logout endpoint

Write-Host "Testing Admin Logout Endpoint" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login
Write-Host "Step 1: Logging in..." -ForegroundColor Yellow
Write-Host ""

$loginData = @{
    email = "admin@techgrantha.com"
    password = "certificate@123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginData
    
    $token = $loginResponse.token
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "User: $($loginResponse.user.email)" -ForegroundColor White
    Write-Host "Token: $($token.Substring(0, 30))..." -ForegroundColor Gray
    Write-Host ""
    
} catch {
    Write-Host "❌ Login failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Step 2: Verify token
Write-Host "Step 2: Verifying token is valid..." -ForegroundColor Yellow
Write-Host ""

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $verifyResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/verify" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Token is valid!" -ForegroundColor Green
    Write-Host "User: $($verifyResponse.user.email)" -ForegroundColor White
    Write-Host "Role: $($verifyResponse.user.role)" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "❌ Token verification failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Step 3: Logout
Write-Host "Step 3: Logging out..." -ForegroundColor Yellow
Write-Host ""

try {
    $logoutResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/logout" `
        -Method Post `
        -Headers $headers
    
    Write-Host "✅ Logout successful!" -ForegroundColor Green
    Write-Host "Message: $($logoutResponse.message)" -ForegroundColor White
    Write-Host ""
    
    Write-Host "💡 Note:" -ForegroundColor Cyan
    Write-Host "   With JWT tokens, the token is still technically valid" -ForegroundColor Gray
    Write-Host "   until it expires. The client should remove it from storage." -ForegroundColor Gray
    Write-Host "   In production, you might implement token blacklisting." -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Logout failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host ""
        Write-Host "Server Response:" -ForegroundColor Yellow
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Write-Host
    }
}

Write-Host ""
Write-Host "Test complete!" -ForegroundColor Cyan
