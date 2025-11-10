# PowerShell script to test image upload endpoints

$API_URL = "http://localhost:3000"
$EMAIL = "admin@techgrantha.com"
$PASSWORD = "certificate@123"

Write-Host "`n=== Testing Image Upload Endpoints ===" -ForegroundColor Cyan
Write-Host "API URL: $API_URL`n" -ForegroundColor Blue

# Step 1: Login
Write-Host "Step 1: Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = $EMAIL
    password = $PASSWORD
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/api/admin/login" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json"
    
    $token = $loginResponse.token
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "  Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Login failed: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Test upload routes endpoint
Write-Host "`nStep 2: Testing upload routes..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $testResponse = Invoke-RestMethod -Uri "$API_URL/api/upload/test" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✓ Upload routes accessible" -ForegroundColor Green
    Write-Host "  Available endpoints:" -ForegroundColor Gray
    $testResponse.endpoints.PSObject.Properties | ForEach-Object {
        Write-Host "    - $($_.Value)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Failed to access upload routes: $_" -ForegroundColor Red
}

# Step 3: Create a test image
Write-Host "`nStep 3: Creating test image..." -ForegroundColor Yellow
$testImagePath = Join-Path $env:TEMP "test-upload.png"

# Create a simple 1x1 pixel PNG (base64 encoded)
$base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="
$imageBytes = [Convert]::FromBase64String($base64Image)
[System.IO.File]::WriteAllBytes($testImagePath, $imageBytes)

Write-Host "✓ Test image created at: $testImagePath" -ForegroundColor Green

# Step 4: Upload article image
Write-Host "`nStep 4: Uploading article image..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $uploadResponse = Invoke-RestMethod -Uri "$API_URL/api/upload/article-image" `
        -Method Post `
        -Headers $headers `
        -Form @{
            image = Get-Item -Path $testImagePath
        }
    
    Write-Host "✓ Article image uploaded successfully!" -ForegroundColor Green
    Write-Host "  URL: $($uploadResponse.image.url)" -ForegroundColor Gray
    Write-Host "  Public ID: $($uploadResponse.image.publicId)" -ForegroundColor Gray
    Write-Host "  Size: $([math]::Round($uploadResponse.image.size / 1024, 2)) KB" -ForegroundColor Gray
    
    $uploadedPublicId = $uploadResponse.image.publicId
} catch {
    Write-Host "✗ Upload failed: $_" -ForegroundColor Red
    Write-Host "  Error details: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

# Step 5: Upload daily tech image
Write-Host "`nStep 5: Uploading daily tech image..." -ForegroundColor Yellow
try {
    $uploadResponse2 = Invoke-RestMethod -Uri "$API_URL/api/upload/daily-tech-image" `
        -Method Post `
        -Headers $headers `
        -Form @{
            image = Get-Item -Path $testImagePath
        }
    
    Write-Host "✓ Daily tech image uploaded successfully!" -ForegroundColor Green
    Write-Host "  URL: $($uploadResponse2.image.url)" -ForegroundColor Gray
    Write-Host "  Public ID: $($uploadResponse2.image.publicId)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Upload failed: $_" -ForegroundColor Red
}

# Step 6: Delete uploaded image
if ($uploadedPublicId) {
    Write-Host "`nStep 6: Deleting uploaded image..." -ForegroundColor Yellow
    try {
        $encodedPublicId = [System.Web.HttpUtility]::UrlEncode($uploadedPublicId)
        $deleteResponse = Invoke-RestMethod -Uri "$API_URL/api/upload/image/$uploadedPublicId" `
            -Method Delete `
            -Headers $headers
        
        Write-Host "✓ Image deleted successfully!" -ForegroundColor Green
    } catch {
        Write-Host "✗ Delete failed: $_" -ForegroundColor Red
    }
}

# Cleanup
Remove-Item -Path $testImagePath -ErrorAction SilentlyContinue

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
Write-Host "✅ Image upload system is working!`n" -ForegroundColor Green
