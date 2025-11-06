# Application Setup & Troubleshooting Guide

## 🚀 Quick Start

### Step 1: Start Backend (Must run first!)
```bash
cd app/backend
python app.py
```
✅ Backend runs on **http://localhost:5000**

### Step 2: Start Frontend (In a new terminal)
```bash
cd app/frontend
npm run dev
```
✅ Frontend runs on **http://localhost:5173**

## ⚠️ Common Issues & Solutions

### Issue: "Failed to execute 'json' on 'Response': Unexpected end of JSON input"

**Cause**: Frontend is trying to reach backend before it's started

**Solution**:
1. Make sure backend is running on port 5000
2. Check terminal shows: `Running on http://127.0.0.1:5000`
3. Restart frontend after backend starts

### Issue: CORS Errors

**Cause**: Frontend and backend on different ports

**Solution**: Already configured! CORS is enabled in backend:
```python
CORS(app)  # Allows all origins
```

### Issue: "Connection refused" or "Cannot reach server"

**Solution**:
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill the process if needed
kill -9 <PID>

# Restart backend
cd app/backend
python app.py
```

## ✅ How to Test

### 1. Test Backend API (cURL)
```bash
# Register Supervisor
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Manager",
    "email": "john@example.com",
    "password": "pass123",
    "role": "supervisor",
    "department": "HR",
    "phone": "1234567890"
  }'

# Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "pass123"
  }'

# Health Check
curl http://localhost:5000/api/health
```

### 2. Test Frontend UI
1. Open http://localhost:5173
2. Click "Don't have an account? Create Account"
3. Choose "Member Login" or "Supervisor Login"
4. Fill in registration form
5. Submit - should redirect to login
6. Login with credentials

## 📋 API Endpoints

### POST /api/register
Register new supervisor or member

**Request:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "password": "string (required)",
  "role": "supervisor|member",
  "phone": "string",
  "department": "string (supervisor only)"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "role": "supervisor|member",
    "phone": "string",
    "is_active": true
  }
}
```

### POST /api/login
Authenticate user

**Request:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "supervisor|member",
  "phone": "string",
  "is_active": true
}
```

### GET /api/health
Check if backend is running

**Response (200):**
```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

## 🗄️ Database

### Default Database: SQLite
```
app/backend/workforce.db
```

### Two Tables:
1. **supervisors** - Admin/supervisor accounts
2. **members** - Employee accounts

### To Reset Database:
```bash
cd app/backend
rm workforce.db
python app.py  # Recreates empty database
```

## 🔧 Environment Setup

### Backend .env (Optional)
```
FLASK_ENV=development
FLASK_PORT=5000
DATABASE_URL=sqlite:///workforce.db
```

### Frontend .env (Optional)
```
VITE_API_URL=http://localhost:5000
```

## 📦 Dependencies

### Backend
- Flask 2.3.0
- SQLAlchemy 1.4.48
- Flask-SQLAlchemy 2.5.1
- Werkzeug 2.3.0

### Frontend
- React 18.2.0
- TypeScript
- Material UI 7.3.5
- React Router 6.21.0
- Vite

## ✨ Key Features

✅ Separate supervisor and member registration
✅ Secure password hashing
✅ Email-based login
✅ SQLite database (no setup required)
✅ PostgreSQL compatible
✅ CORS enabled
✅ Error handling
✅ Input validation

## 🐛 Debugging Tips

### 1. Check Backend Console
Look for error messages in the terminal running `python app.py`

### 2. Check Browser Console
- Press F12 or Ctrl+Shift+K
- Look for error messages in Console tab
- Check Network tab for failed requests

### 3. Verify Backend is Running
```bash
curl http://localhost:5000/api/health
```
Should return: `{"status":"ok","message":"Backend is running"}`

### 4. Check Port is Available
```bash
# List all processes on port 5000
lsof -i :5000

# Kill process if stuck
kill -9 <PID>
```

## 🚀 Next Steps

1. **Create Users**: Use registration forms to create test accounts
2. **Login**: Test login with created credentials
3. **Build Dashboard**: Add authenticated pages after successful login
4. **Add Features**: Implement productivity tracking, analytics, etc.

## 📞 Support

If you encounter issues:
1. Ensure backend is running first
2. Check both frontend and backend terminals for errors
3. Verify ports 5000 and 5173 are available
4. Try restarting both servers
5. Clear browser cache (Ctrl+Shift+Delete)
