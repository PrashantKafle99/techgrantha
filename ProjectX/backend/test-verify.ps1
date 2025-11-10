# PowerShell script to test admin verify endpoint

Write-Host "Testing Admin Verify Endpoint" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login to get token
Write-Host "Step 1: Logging in to get token..." -ForegroundColor Yellow
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
    Write-Host "Token: $($token.Substring(0, 30))..." -ForegroundColor Gray
    Write-Host ""
    
} catch {
    Write-Host "❌ Login failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Step 2: Verify token
Write-Host "Step 2: Verifying token..." -ForegroundColor Yellow
Write-Host ""

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $verifyResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/verify" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Token verification successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "User Details:" -ForegroundColor Cyan
    Write-Host "  Email: $($verifyResponse.user.email)" -ForegroundColor White
    Write-Host "  Role: $($verifyResponse.user.role)" -ForegroundColor White
    Write-Host "  ID: $($verifyResponse.user.id)" -ForegroundColor White
    Write-Host "  Created: $($verifyResponse.user.createdAt)" -ForegroundColor White
    
} catch {
    Write-Host "❌ Token verification failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host ""
        Write-Host "Server Response:" -ForegroundColor Yellow
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Write-Host
    }
}

Write-Host ""
Write-Host "Test complete!" -ForegroundColor Cyan
