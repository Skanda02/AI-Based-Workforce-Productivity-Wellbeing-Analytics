"""
Database initialization script
Creates all necessary tables in the database
"""
import sys
import logging
from database import Base, engine, SessionLocal
from database import (
    User, OAuthToken, DataFetch, Feature, WellbeingScore,
    EmployeeAttendance, OvertimeTracker, Alert, ManagerAction,
    ManagerPenalty, WellbeingFeedback, TeamWellbeingCheck, TeamMember
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_database():
    """Initialize database tables"""
    try:
        logger.info("🔧 Creating database tables...")
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        logger.info("✅ Database tables created successfully!")
        
        # Test connection
        db = SessionLocal()
        try:
            # Try a simple query to verify connection
            db.execute("SELECT 1")
            logger.info("✅ Database connection verified!")
        finally:
            db.close()
            
        return True
        
    except Exception as e:
        logger.error(f"❌ Error creating database tables: {e}")
        return False


def drop_all_tables():
    """Drop all tables (USE WITH CAUTION!)"""
    try:
        logger.warning("⚠️  Dropping all database tables...")
        Base.metadata.drop_all(bind=engine)
        logger.info("✅ All tables dropped successfully!")
        return True
    except Exception as e:
        logger.error(f"❌ Error dropping tables: {e}")
        return False


def reset_database():
    """Drop and recreate all tables (USE WITH CAUTION!)"""
    logger.warning("⚠️  Resetting database (drop and recreate)...")
    if drop_all_tables():
        return init_database()
    return False


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Database initialization utility")
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Drop and recreate all tables (WARNING: destroys all data!)"
    )
    parser.add_argument(
        "--drop",
        action="store_true",
        help="Drop all tables (WARNING: destroys all data!)"
    )
    
    args = parser.parse_args()
    
    if args.reset:
        confirm = input("⚠️  This will DELETE ALL DATA! Type 'YES' to confirm: ")
        if confirm == "YES":
            success = reset_database()
        else:
            logger.info("Reset cancelled.")
            success = False
    elif args.drop:
        confirm = input("⚠️  This will DROP ALL TABLES! Type 'YES' to confirm: ")
        if confirm == "YES":
            success = drop_all_tables()
        else:
            logger.info("Drop cancelled.")
            success = False
    else:
        success = init_database()
    
    sys.exit(0 if success else 1)
