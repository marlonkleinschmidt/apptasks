const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'tasks.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    done INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  const fakeUser = {
    username: 'admin',
    password: 'admin123'
  };

  bcrypt.hash(fakeUser.password, 10, (err, hash) => {
    if (err) {
      return;
    }

    db.get('SELECT id FROM users WHERE username = ?', [fakeUser.username], (err, row) => {
      if (err) {
        return;
      }

      if (!row) {
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [fakeUser.username, hash], (err) => {
        });
      }
    });
  });
});

module.exports = db;

