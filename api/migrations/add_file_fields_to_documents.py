#!/usr/bin/env python3
"""
Migration script to add file-related fields to documents table.
"""

import sqlite3
import os
from pathlib import Path

def run_migration():
    """Run the migration to add file fields to documents table."""
    
    # Get the database path
    db_path = Path("../data/ideas.db")
    
    if not db_path.exists():
        print("❌ Database file not found. Please run the setup script first.")
        return False
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("🔄 Adding file-related fields to documents table...")
        
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(documents)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add new columns if they don't exist
        if 'file_path' not in columns:
            cursor.execute("ALTER TABLE documents ADD COLUMN file_path TEXT")
            print("✅ Added file_path column")
        
        if 'original_filename' not in columns:
            cursor.execute("ALTER TABLE documents ADD COLUMN original_filename TEXT")
            print("✅ Added original_filename column")
        
        if 'file_size' not in columns:
            cursor.execute("ALTER TABLE documents ADD COLUMN file_size INTEGER")
            print("✅ Added file_size column")
        
        if 'mime_type' not in columns:
            cursor.execute("ALTER TABLE documents ADD COLUMN mime_type TEXT")
            print("✅ Added mime_type column")
        
        # Create uploads directory if it doesn't exist
        uploads_dir = Path("uploads")
        uploads_dir.mkdir(exist_ok=True)
        print("✅ Created uploads directory")
        
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