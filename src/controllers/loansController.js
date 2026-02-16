const { getDb } = require('../models/database');

async function list(req, res) {
  try {
    const db = await getDb();
    const loans = await db.all(`
      SELECT loans.*, books.title as book_title, users.name as user_name 
      FROM loans 
      JOIN books ON loans.book_id = books.id 
      JOIN users ON loans.user_id = users.id 
      ORDER BY loans.id DESC
    `);

    res.render('loans', {
      title: 'Empréstimos - Bibly',
      activePage: 'loans',
      user: req.session.user || { name: 'Visitante', role: 'guest' },
      loans: loans
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar empréstimos");
  }
}

async function create(req, res) {
  try {
    const db = await getDb();
    const bookId = req.params.id;
    const userId = req.session.user ? req.session.user.id : null;

    if (!userId) {
      return res.redirect('/login');
    }

    const book = await db.get('SELECT stock FROM books WHERE id = ?', [bookId]);

    if (!book || book.stock <= 0) {
      return res.status(400).send("Não há unidades disponíveis deste livro.");
    }

    await db.run(`
      INSERT INTO loans (user_id, book_id, loan_date, status)
      VALUES (?, ?, date('now'), 'ativo')
    `, [userId, bookId]);

    await db.run(`
      UPDATE books 
      SET stock = stock - 1,
          available = CASE WHEN (stock - 1) <= 0 THEN 0 ELSE 1 END
      WHERE id = ? AND stock > 0
    `, [bookId]);

    res.redirect('/emprestimos');
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao processar o empréstimo.");
  }
}

module.exports = {
  list,
  create
};