const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let dbPromise;

async function init() {
  if (!dbPromise) {
    dbPromise = open({
      filename: path.join(__dirname, '..', '..', 'data', 'database.sqlite'),
      driver: sqlite3.Database,
    });

    const db = await dbPromise;
    await db.exec('PRAGMA foreign_keys = ON');

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        year INTEGER,
        category TEXT,
        isbn TEXT UNIQUE,
        available INTEGER NOT NULL DEFAULT 1,
        image_url TEXT
      );
    `);

    const bookColumns = await db.all("PRAGMA table_info('books')");
    const hasImageUrl = bookColumns.some((c) => c && c.name === 'image_url');
    if (!hasImageUrl) {
      await db.exec('ALTER TABLE books ADD COLUMN image_url TEXT');
    }

    await db.exec(`
    CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    loan_date TEXT NOT NULL,
    return_date TEXT,
    weeks INTEGER NOT NULL DEFAULT 1,
    total_price REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    );
  `);
  }

  return dbPromise;
}

function getDb() {
  return init();
}

module.exports = {
  getDb,
};
