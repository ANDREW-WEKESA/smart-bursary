# Quick registration script for demo accounts

Write-Host "`n🚀 Creating Demo Accounts for SmartBursary`n" -ForegroundColor Cyan

# Admin Account
Write-Host "Creating Admin Account..." -ForegroundColor Yellow
$adminBody = @{
    username = "admin"
    email = "admin@smartbursary.com"
    password = "admin123"
    full_name = "System Administrator"
    phone_number = "+254700000000"
} | ConvertTo-Json

try {
    $adminResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/register" `
        -Method Post `
        -Body $adminBody `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "✅ Admin account created successfully!" -ForegroundColor Green
    Write-Host "   Email: admin@smartbursary.com" -ForegroundColor White
    Write-Host "   Password: admin123" -ForegroundColor White
} catch {
    if ($_.Exception.Message -like "*409*" -or $_.Exception.Message -like "*already*") {
        Write-Host "⚠️  Admin account already exists" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error creating admin: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""

# Applicant Account
Write-Host "Creating Applicant Account..." -ForegroundColor Yellow
$applicantBody = @{
    username = "johndoe"
    email = "john@demo.com"
    password = "demo123"
    full_name = "John Doe"
    phone_number = "+254712345678"
} | ConvertTo-Json

try {
    $applicantResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/register" `
        -Method Post `
        -Body $applicantBody `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "✅ Applicant account created successfully!" -ForegroundColor Green
    Write-Host "   Email: john@demo.com" -ForegroundColor White
    Write-Host "   Password: demo123" -ForegroundColor White
} catch {
    if ($_.Exception.Message -like "*409*" -or $_.Exception.Message -like "*already*") {
        Write-Host "⚠️  Applicant account already exists" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error creating applicant: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n" + "="*60 -ForegroundColor Cyan
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "="*60 -ForegroundColor Cyan
Write-Host "`n📝 Login Credentials:`n" -ForegroundColor White
Write-Host "ADMIN ACCOUNT:" -ForegroundColor Magenta
Write-Host "  Email: admin@smartbursary.com"
Write-Host "  Password: admin123"
Write-Host ""
Write-Host "APPLICANT ACCOUNT:" -ForegroundColor Cyan
Write-Host "  Email: john@demo.com"
Write-Host "  Password: demo123"
Write-Host ""
Write-Host "🌐 API Docs: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "🖥️  Frontend: http://localhost:3001" -ForegroundColor Yellow
Write-Host ""
Write-Host "Note: To make admin account work, update the database" -ForegroundColor Yellow
Write-Host ""
