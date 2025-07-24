import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/ideas.db');

// Ensure the data directory exists
import fs from 'fs';
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new sqlite3.Database(dbPath);

// Initialize database with schema
export const initializeDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      // Create ideas table
      db.run(`
        CREATE TABLE IF NOT EXISTS ideas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          content TEXT,
          category TEXT,
          status TEXT DEFAULT 'seedling',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create tags table
      db.run(`
        CREATE TABLE IF NOT EXISTS tags (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL
        )
      `);

      // Create idea_tags junction table
      db.run(`
        CREATE TABLE IF NOT EXISTS idea_tags (
          idea_id INTEGER,
          tag_id INTEGER,
          FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE,
          FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
          PRIMARY KEY (idea_id, tag_id)
        )
      `);

      // Create embeddings table for semantic search
      db.run(`
        CREATE TABLE IF NOT EXISTS embeddings (
          idea_id INTEGER PRIMARY KEY,
          embedding TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
        )
      `);

      // Create documents table for idea documents
      db.run(`
        CREATE TABLE IF NOT EXISTS documents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          idea_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          content TEXT,
          document_type TEXT DEFAULT 'uploaded',
          conversation_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
        )
      `);

      // Create action_plans table for AI-generated action plans
      db.run(`
        CREATE TABLE IF NOT EXISTS action_plans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          idea_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          timeline TEXT NOT NULL,
          vision TEXT NOT NULL,
          resources TEXT NOT NULL,
          constraints TEXT NOT NULL,
          priority INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
        )
      `);

      // Create document_versions table for versioning
      db.run(`
        CREATE TABLE IF NOT EXISTS document_versions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          document_id INTEGER NOT NULL,
          version_number INTEGER NOT NULL,
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_by TEXT DEFAULT 'user',
          FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.error('Error creating tables:', err);
          reject(err);
        } else {
          // Run migrations to update existing tables
          runMigrations().then(() => {
            console.log('✅ Database initialized successfully');
            resolve();
          }).catch((migrationErr) => {
            console.error('Error running migrations:', migrationErr);
            reject(migrationErr);
          });
        }
      });
    });
  });
};

// Migration function to update existing database schema
const runMigrations = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if documents table exists and add new columns if needed
    db.get("PRAGMA table_info(documents)", (err, row) => {
      if (err) {
        console.log('Documents table does not exist yet, skipping migration');
        resolve();
        return;
      }

      // Check if document_type column exists
      db.get("PRAGMA table_info(documents)", (err, rows) => {
        if (err) {
          console.log('Error checking table schema:', err);
          resolve();
          return;
        }

        // Convert rows to array and check if document_type column exists
        db.all("PRAGMA table_info(documents)", (err, columns) => {
          if (err) {
            console.log('Error getting table info:', err);
            resolve();
            return;
          }

          const hasDocumentType = columns.some((col: any) => col.name === 'document_type');
          const hasConversationId = columns.some((col: any) => col.name === 'conversation_id');

          if (!hasDocumentType) {
            console.log('Adding document_type column to documents table...');
            db.run("ALTER TABLE documents ADD COLUMN document_type TEXT DEFAULT 'uploaded'", (err) => {
              if (err) {
                console.error('Error adding document_type column:', err);
                reject(err);
                return;
              }
              console.log('✅ Added document_type column');
            });
          }

          if (!hasConversationId) {
            console.log('Adding conversation_id column to documents table...');
            db.run("ALTER TABLE documents ADD COLUMN conversation_id TEXT", (err) => {
              if (err) {
                console.error('Error adding conversation_id column:', err);
                reject(err);
                return;
              }
              console.log('✅ Added conversation_id column');
            });
          }

          // Check if document_versions table exists
          db.get("PRAGMA table_info(document_versions)", (err, versionRow) => {
            if (err) {
              console.log('Document versions table does not exist yet, skipping migration');
              console.log('✅ Database migrations completed');
              resolve();
              return;
            }
            console.log('✅ Document versions table exists');
            console.log('✅ Database migrations completed');
            resolve();
          });

          console.log('✅ Database migrations completed');
          resolve();
        });
      });
    });
  });
};

// Helper function to run queries with promises
export const runQuery = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Helper function to run single queries (INSERT, UPDATE, DELETE)
export const runSingleQuery = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}; 