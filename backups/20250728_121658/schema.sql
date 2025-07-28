CREATE TABLE ideas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          content TEXT,
          category TEXT,
          status TEXT DEFAULT 'seedling',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE tags (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL
        );
CREATE TABLE idea_tags (
          idea_id INTEGER,
          tag_id INTEGER,
          FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE,
          FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
          PRIMARY KEY (idea_id, tag_id)
        );
CREATE TABLE embeddings (
          idea_id INTEGER PRIMARY KEY,
          embedding TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
        );
CREATE TABLE documents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          idea_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          content TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, document_type TEXT DEFAULT 'uploaded', conversation_id TEXT,
          FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
        );
CREATE TABLE action_plans (
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
        );
CREATE TABLE document_versions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          document_id INTEGER NOT NULL,
          version_number INTEGER NOT NULL,
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_by TEXT DEFAULT 'user',
          FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
        );
