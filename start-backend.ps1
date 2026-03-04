# Start Fraud Detection Backend with Supabase
Write-Host "========================================"
Write-Host " Starting Fraud Detection Backend"
Write-Host "========================================"
Write-Host ""

cd backend

# Set environment variables
$env:DB_URL = "jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
$env:DB_USER = "postgres.soxsihcynqjkwbmchsqp"
$env:DB_PASS = "Amitrajput123!"
$env:JWT_SECRET = "fraud-detection-jwt-secret-key-2025-production-ready-system-with-256-bit-security"

Write-Host "Starting Spring Boot application..."
Write-Host "This may take 30-60 seconds..."
Write-Host ""
Write-Host "Backend will be available at: http://localhost:8080"
Write-Host "API Docs will be at: http://localhost:8080/swagger-ui.html"
Write-Host ""

mvn spring-boot:run `
  "-Dspring-boot.run.arguments=--spring.datasource.url=$env:DB_URL --spring.datasource.username=$env:DB_USER --spring.datasource.password=$env:DB_PASS --jwt.secret=$env:JWT_SECRET"
