@echo off
echo ========================================
echo  Starting Fraud Detection Backend
echo ========================================
echo.

cd backend

if not exist .env (
    echo Creating .env file from .env.supabase...
    copy .env.supabase .env
    echo .env file created!
    echo.
)

echo Starting Spring Boot application...
echo This may take 30-60 seconds...
echo.
echo Backend will be available at: http://localhost:8080
echo API Docs will be at: http://localhost:8080/swagger-ui.html
echo.

echo Loading environment variables from .env file...
for /f "tokens=1,2 delims==" %%a in (.env) do (
    if not "%%a"=="" if not "%%a:~0,1%"=="#" set %%a=%%b
)

mvn spring-boot:run -Dspring-boot.run.arguments="--spring.datasource.url=%DB_URL% --spring.datasource.username=%DB_USER% --spring.datasource.password=%DB_PASS% --jwt.secret=%JWT_SECRET%"
