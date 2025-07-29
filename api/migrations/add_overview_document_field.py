#!/usr/bin/env python3
"""
Migration script to add is_overview field to documents table.
"""

import sqlite3
import os
from pathlib import Path

def run_migration():
    """Run the migration to add is_overview field to documents table."""
    
    # Get the database path
    db_path = Path("../data/ideas.db")
    
    if not db_path.exists():
        print("❌ Database file not found. Please run the setup script first.")
        return False
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("🔄 Adding is_overview field to documents table...")
        
        # Check if column already exists
        cursor.execute("PRAGMA table_info(documents)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add new column if it doesn't exist
        if 'is_overview' not in columns:
            cursor.execute("ALTER TABLE documents ADD COLUMN is_overview BOOLEAN DEFAULT FALSE")
            print("✅ Added is_overview column")
        
        # Commit changes
        conn.commit()
        conn.close()
        
        print("✅ Migration completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

if __name__ == "__main__":
    run_migration() 