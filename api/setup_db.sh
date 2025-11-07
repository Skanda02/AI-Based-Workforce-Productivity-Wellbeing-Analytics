#!/bin/bash
# Quick database setup and test script

echo "🔧 Database Setup Utility"
echo "=========================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set!"
    echo "Please set it in your .env file or export it:"
    echo "export DATABASE_URL='postgresql://user:pass@host:port/dbname'"
    exit 1
fi

echo "📊 Database URL: ${DATABASE_URL:0:30}..."
echo ""

# Load environment variables if .env exists
if [ -f .env ]; then
    echo "📝 Loading .env file..."
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "🔄 Initializing database tables..."
python init_db.py

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database initialized successfully!"
    echo ""
    echo "🧪 Testing database connection..."
    python -c "
from database import SessionLocal, User, OAuthToken
import sys

try:
    db = SessionLocal()
    
    # Test query
    db.execute('SELECT 1')
    
    # Check if tables exist
    user_count = db.query(User).count()
    token_count = db.query(OAuthToken).count()
    
    print(f'✅ Database connection OK')
    print(f'📊 Users: {user_count}')
    print(f'🔑 OAuth Tokens: {token_count}')
    
    db.close()
    sys.exit(0)
except Exception as e:
    print(f'❌ Database connection failed: {e}')
    sys.exit(1)
"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Database is ready!"
    else
        echo ""
        echo "⚠️  Database connection test failed"
        exit 1
    fi
else
    echo ""
    echo "❌ Database initialization failed"
    exit 1
fi
