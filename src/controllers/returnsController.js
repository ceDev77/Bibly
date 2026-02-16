const { getDb } = require('../models/database');

async function list(req, res) {
  try {
    const db = await getDb();
    
    let returns = [];
    try {
      returns = await db.all('SELECT * FROM returns ORDER BY id DESC');
    } catch (dbError) {
      returns = [];
    }

    res.render('returns', {
      title: 'Devoluções - Bibly',
      activePage: 'returns',
      user: req.session.user || { name: 'Visitante', role: 'guest' },
      returns: returns
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar devoluções");
  }
}

module.exports = {
  list
};