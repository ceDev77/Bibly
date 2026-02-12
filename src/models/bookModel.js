const { getDb } = require('./database');

async function createBook({ title, author, year, category, isbn, available, image_url }) {
  const db = await getDb();

  const result = await db.run(
    `INSERT INTO books (title, author, year, category, isbn, available, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)` ,
    [
      title,
      author,
      year ?? null,
      category ?? null,
      isbn ?? null,
      available ? 1 : 0,
      image_url ?? null,
    ]
  );

  const created = await db.get('SELECT * FROM books WHERE id = ?', [result.lastID]);
  return created;
}

async function listBooks() {
  const db = await getDb();
  const books = await db.all('SELECT * FROM books ORDER BY id DESC');
  return books;
}

module.exports = {
  createBook,
  listBooks,
};
