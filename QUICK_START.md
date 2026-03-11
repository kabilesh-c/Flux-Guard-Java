# 🚀 Quick Start Guide - Flux-Guard-Java

## ⚡ 5-Minute Setup

### Prerequisites
- Docker & Docker Compose installed
- 8GB RAM available
- Ports 80, 8080, 5432 available

### Start the System

```bash
# Clone and start
git clone <repository-url>
cd fraud-detection
docker-compose up -d

# Wait 60 seconds for services to start
# Check status
docker-compose ps
```

### Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **API Docs**: http://localhost:8080/swagger-ui.html

### Login

```
Email: admin@fraud-detection.com
Password: Admin@123
```

### Test the System

1. **View Dashboard** - See pre-loaded sample data
2. **Create Transaction** - Click "New Transaction" button
3. **Watch Real-Time Alert** - See WebSocket notification
4. **View Transaction Details** - Click on transaction ID
5. **Manage Rules** - Navigate to Rules page

---

## 🛠️ Manual Setup (No Docker)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Database

```bash
# Create PostgreSQL database
createdb fraud_detection

# Migrations run automatically on backend startup
```

---

## 📊 Sample API Calls

### Submit Transaction

```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "TEST001",
    "user_id": "USR001",
    "amount": 15000,
    "currency": "USD",
    "source_account": "ACC001",
    "dest_account": "ACC002",
    "ip_address": "192.168.1.1",
    "device_fingerprint": "DEV001"
  }'
```

### Get All Transactions

```bash
curl http://localhost:8080/api/transactions
```

### Get All Rules

```bash
curl http://localhost:8080/api/rules
```

---

## 🎯 Key Features to Try

### 1. Real-Time Alerts
- Submit a high-value transaction (>$10,000)
- Watch for instant alert notification
- Check Alerts page for details

### 2. Risk Scoring
- Submit transactions with different amounts
- View risk scores (0-100)
- See which rules triggered

### 3. Dashboard Analytics
- View KPI cards
- Explore time-series charts
- Check status distribution

### 4. Rule Management
- Navigate to Rules page
- Toggle rule active/inactive
- View rule details and expressions

---

## 🔧 Common Commands

### Docker

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build

# Reset database
docker-compose down -v
docker-compose up -d
```

### Backend

```bash
# Run tests
./mvnw test

# Build JAR
./mvnw clean package

# Run migrations
./mvnw flyway:migrate

# Clean database
./mvnw flyway:clean
```

### Frontend

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8080 is in use
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # Mac/Linux

# Check database connection
docker-compose logs postgres
```

### Frontend won't start
```bash
# Clear node_modules
rm -rf node_modules
npm install

# Check if port 5173 is in use
netstat -ano | findstr :5173  # Windows
lsof -i :5173                 # Mac/Linux
```

### WebSocket not connecting
- Check backend is running
- Verify WebSocket URL in frontend .env
- Check browser console for errors

### Database errors
```bash
# Reset database
docker-compose down -v
docker-compose up -d

# Wait 60 seconds for initialization
```

---

## 📚 Next Steps

1. **Read Documentation**
   - README.md - Project overview
   - SETUP_GUIDE.md - Detailed setup
   - PROJECT_SUMMARY.md - Technical details

2. **Explore Features**
   - Create custom rules
   - Submit test transactions
   - View analytics

3. **Customize**
   - Adjust risk thresholds
   - Add new rules
   - Modify UI colors

4. **Deploy**
   - Follow deployment guide
   - Configure production settings
   - Set up monitoring

---

## 🆘 Get Help

- **Documentation**: See SETUP_GUIDE.md
- **API Docs**: http://localhost:8080/swagger-ui.html
- **Issues**: GitHub Issues
- **Email**: support@fraud-detection.com

---

## ✅ Verification Checklist

After starting the system, verify:

- [ ] Frontend loads at http://localhost
- [ ] Backend health check: http://localhost:8080/actuator/health
- [ ] Can login with default credentials
- [ ] Dashboard shows sample data
- [ ] Can create new transaction
- [ ] Real-time alert appears
- [ ] WebSocket status shows "Connected"
- [ ] API documentation accessible

---

**Time to First Transaction: ~5 minutes** ⚡

*Happy fraud detecting!* 🛡️

> **Note:** For troubleshooting, refer to [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
