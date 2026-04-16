const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const dbDir = path.join(__dirname, '..', 'data')
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })

const dbPath = process.env.DB_PATH || path.join(dbDir, 'app.db')
const db = new Database(dbPath)

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    email     TEXT    UNIQUE NOT NULL,
    password  TEXT    NOT NULL,
    created_at TEXT   DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS resumes (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id        INTEGER REFERENCES users(id) ON DELETE SET NULL,
    file_name      TEXT,
    file_type      TEXT,
    extracted_data TEXT,   -- JSON string
    uploaded_at    TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS learning_paths (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
    resume_id   INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    career_path TEXT,
    path_rank   INTEGER,
    topics      TEXT,      -- JSON string
    created_at  TEXT       DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id             INTEGER REFERENCES users(id) ON DELETE SET NULL,
    topic               TEXT,
    resource_url        TEXT,
    resource_title      TEXT,
    source_type         TEXT,
    rating              INTEGER,
    notes               TEXT,
    time_spent_minutes  INTEGER,
    created_at          TEXT DEFAULT (datetime('now'))
  );
`)

module.exports = db
