const { getDb } = require('../models/database');

async function index(req, res) {
  try {
    const db = await getDb();

    const recentBooks = await db.all(
      'SELECT id, title, author, image_url FROM books ORDER BY id DESC LIMIT 4'
    );

    const totalBooksRow = await db.get('SELECT COUNT(*) AS count FROM books');

    const activeLoansRow = await db.get(
      "SELECT COUNT(*) AS count FROM loans WHERE status IN ('em aberto', 'vencido')"
    );

    const totalUsersRow = await db.get("SELECT COUNT(*) AS count FROM users WHERE role != 'admin'");

    res.render('index', {
      title: 'Bibly - Sistema de Biblioteca',
      activePage: 'dashboard',
      user: req.session.user || { name: 'Visitante', role: 'guest' },
      stats: {
        totalBooks: totalBooksRow?.count || 0,
        activeLoans: activeLoansRow?.count || 0,
        totalUsers: totalUsersRow?.count || 0
      },
      recentBooks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar o banco de dados.");
  }
}

module.exports = {
  index,
};