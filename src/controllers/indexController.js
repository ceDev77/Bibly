const { getDb } = require('../models/database');

async function index(req, res) {
  try {
    const db = await getDb();

    const recentBooks = await db.all(
      'SELECT id, title, author, image_url FROM books ORDER BY id DESC LIMIT 6'
    );

    const totalBooksRow = await db.get('SELECT COUNT(*) AS count FROM books');

    let activeLoans = 0;
    try {
      const activeLoansRow = await db.get(
        "SELECT COUNT(*) AS count FROM loans WHERE status = 'active' OR status IS NULL"
      );
      activeLoans = activeLoansRow?.count || 0;
    } catch (e) {
      activeLoans = 0; 
    }

    res.render('index', {
      title: 'Bibly - Sistema de Biblioteca',
      activePage: 'dashboard',
      user: {
        id: 1,
        name: 'Usuário Teste',
        email: 'usuario@teste.com',
        role: 'admin',
      },
      stats: {
        totalBooks: totalBooksRow?.count || 0,
        activeLoans: activeLoans,
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