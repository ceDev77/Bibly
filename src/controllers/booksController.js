const { getDb } = require('../models/database');

async function list(req, res) {
  try {
    const db = await getDb();
    const books = await db.all('SELECT * FROM books ORDER BY title ASC');

    res.render('books', {
      title: 'Catálogo de Livros - Bibly',
      activePage: 'books',
      user: req.session.user || { name: 'Visitante', role: 'guest' },
      books: books
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar os livros.");
  }
}

async function create(req, res) {
  try {
    const { title, author, year, category, isbn, image_url, stock, description } = req.body;
    const db = await getDb();
    
    const quantity = parseInt(stock) || 1;
    const isAvailable = quantity > 0 ? 1 : 0;

    await db.run(
      'INSERT INTO books (title, author, year, category, isbn, available, image_url, stock, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, author, year, category, isbn, isAvailable, image_url, quantity, description]
    );

    res.redirect('/livros');
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao cadastrar livro.");
  }
}

function newForm(req, res) {
  res.render('admin/books-new', { 
    title: 'Cadastrar Livro - Bibly',
    activePage: 'books', 
    user: req.session.user || { name: 'Visitante', role: 'guest' }
  });
}

async function showDetail(req, res) {
  try {
    const id = req.params.id;
    if (!id || isNaN(Number(id))) return res.status(400).send("ID inválido");

    const db = await getDb();
    const book = await db.get('SELECT * FROM books WHERE id = ?', [id]);

    if (!book) {
      return res.status(404).send("Livro não encontrado.");
    }

    res.render('book-details', {
      title: `${book.title} - Bibly`,
      activePage: 'books',
      user: req.session.user || { name: 'Visitante', role: 'guest' },
      book: book
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro no servidor.");
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { title, author, category, isbn, stock, description, year } = req.body;
    const db = await getDb();

    const quantity = parseInt(stock) || 0;
    const isAvailable = quantity > 0 ? 1 : 0;

    await db.run(
      `UPDATE books 
       SET title = ?, author = ?, category = ?, isbn = ?, stock = ?, available = ?, description = ?, year = ?
       WHERE id = ?`,
      [title, author, category, isbn, quantity, isAvailable, description, year, id]
    );

    const book = await db.get('SELECT * FROM books WHERE id = ?', [id]);

    res.render('book-details', {
      title: `${book.title} - Bibly`,
      activePage: 'books',
      user: req.session.user || { name: 'Visitante', role: 'guest' },
      book: book,
      success: 'Alterações salvas com sucesso!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao atualizar o livro.");
  }
}

module.exports = { 
  list, 
  create, 
  newForm,
  showDetail,
  update
};