const { getDb } = require('../models/database');

async function list(req, res) {
  const db = await getDb();
  const books = await db.all('SELECT * FROM books ORDER BY title ASC');

  res.render('books', {
    title: 'Catálogo de Livros - Bibly',
    activePage: 'books',
    user: { name: 'Usuário Teste' },
    books
  });
}

async function create(req, res) {
  const { title, author, year, category, isbn, image_url } = req.body;
  const db = await getDb();
  
  await db.run(
    'INSERT INTO books (title, author, year, category, isbn, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    [title, author, year, category, isbn, image_url]
  );

  res.redirect('/livros');
}

module.exports = { 
  list, 
  create, 
  newForm: (req, res) => res.render('books-new', { activePage: 'books', user: { name: 'Usuário Teste' } }) 
};