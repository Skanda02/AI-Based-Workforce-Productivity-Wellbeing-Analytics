# Database Setup Guide

## Quick Start

### Local Development

1. **Install PostgreSQL** (if not already installed)
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Linux
   sudo apt-get install postgresql
   sudo service postgresql start
   ```

2. **Create Database**
   ```bash
   createdb wellbeing_db
   # Or: psql -c "CREATE DATABASE wellbeing_db;"
   ```

3. **Set Database URL**
   ```bash
   export DATABASE_URL="postgresql://localhost/wellbeing_db"
   # Or add to .env file
   ```

4. **Initialize Tables**
   ```bash
   cd api
   ./setup_db.sh
   # Or: python init_db.py
   ```

### Production (Render)

1. **Create PostgreSQL Database**
   - Render Dashboard → New → PostgreSQL
   - Name: `workforce-wellbeing-db`
   - Region: Same as API service
   - Plan: Free or Starter

2. **Set Environment Variable**
   - Copy Internal Database URL from Render
   - Add to API service: `DATABASE_URL=<internal-url>`

3. **Deploy** - Tables are created automatically via buildCommand

## Database Models

### Core Tables

#### users
- User accounts and profiles
- Fields: id, email, organization, created_at, is_active

#### oauth_tokens
- OAuth access and refresh tokens (encrypted)
- Fields: user_id, provider, access_token, refresh_token, expires_at

#### data_fetches
- Track data synchronization operations
- Fields: user_id, provider, data_type, status, records_fetched

#### features
- Extracted ML features for analysis
- Fields: user_id, date, provider, feature_name, feature_value

#### wellbeing_scores
- Computed wellbeing metrics
- Fields: user_id, date, stress_score, burnout_risk, recommendations

### Attendance & Monitoring

#### employee_attendance
- Login/logout tracking
- Fields: employee_id, login_time, logout_time, is_overtime

#### overtime_tracker
- Overtime monitoring and thresholds
- Fields: employee_id, manager_id, overtime_count, threshold_reached

### Alert System

#### alerts
- Alert notifications
- Fields: alert_type, employee_id, recipient_id, status, priority

#### manager_actions
- Track manager responses to alerts
- Fields: alert_id, manager_id, action_taken, action_date

#### manager_penalties
- Penalties for non-responsive managers
- Fields: manager_id, reason, penalty_type, penalty_amount

### Wellbeing Feedback

#### wellbeing_feedback
- Team feedback on colleague wellbeing
- Fields: employee_id, feedback_provider_id, is_doing_well, concerns

#### team_wellbeing_checks
- Scheduled team check-ins
- Fields: team_id, employee_id, scheduled_date, responses_count

#### team_members
- Team membership and relationships
- Fields: team_id, employee_id, manager_id, role

## Database Operations

### Initialize Database
```bash
cd api
python init_db.py
```

### Reset Database (⚠️  Deletes all data!)
```bash
python init_db.py --reset
# Type 'YES' to confirm
```

### Drop All Tables (⚠️  Deletes all data!)
```bash
python init_db.py --drop
# Type 'YES' to confirm
```

### Test Connection
```bash
python -c "
from database import SessionLocal, User, OAuthToken
db = SessionLocal()
print(f'Connection OK - Users: {db.query(User).count()}')
db.close()
"
```

### Check Tables
```bash
psql $DATABASE_URL -c "\dt"
```

### Manual Table Creation (PostgreSQL)
```sql
-- Connect to database
psql $DATABASE_URL

-- List tables
\dt

-- Check specific table
\d oauth_tokens

-- Count records
SELECT COUNT(*) FROM oauth_tokens;
```

## Environment Variables

Required in `.env` or Render environment:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/wellbeing_db

# For Render (use Internal Database URL)
DATABASE_URL=postgresql://user:password@internal-host/dbname
```

## Troubleshooting

### "relation does not exist" error
```bash
# Tables not created, run:
cd api
python init_db.py
```

### Connection refused
```bash
# Check PostgreSQL is running
brew services list  # macOS
sudo service postgresql status  # Linux

# Check DATABASE_URL is correct
echo $DATABASE_URL
```

### Permission denied
```bash
# Grant permissions (PostgreSQL)
psql -c "GRANT ALL PRIVILEGES ON DATABASE wellbeing_db TO your_user;"
```

### SSL connection error (Render)
```bash
# Render requires SSL, add to DATABASE_URL:
?sslmode=require
```

## Migrations (Future)

For production, consider using Alembic for database migrations:

```bash
# Install Alembic
pip install alembic

# Initialize
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head
```

## Backup & Restore

### Backup
```bash
# Dump database
pg_dump $DATABASE_URL > backup.sql

# Dump with timestamp
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore
```bash
# Restore from backup
psql $DATABASE_URL < backup.sql
```

## Security Notes

- ⚠️  Never commit DATABASE_URL to git
- ✅ Use environment variables
- ✅ Tokens are encrypted in database
- ✅ Use Internal Database URL on Render (not external)
- ✅ Enable SSL for production databases
- ✅ Regular backups recommended

## Need Help?

Check `DEPLOYMENT_FIXES.md` for comprehensive deployment guide.
