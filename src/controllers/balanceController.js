const { getDb } = require('../models/database');

async function list(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const db = await getDb();

    let query = 'SELECT * FROM balance WHERE 1=1';
    const params = [];

    if (startDate) {
      query += ' AND date(received_at) >= date(?)';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND date(received_at) <= date(?)';
      params.push(endDate);
    }

    query += ' ORDER BY received_at DESC';

    const records = await db.all(query, params);

    const totalBalance = records.reduce((sum, record) => sum + record.amount, 0);

    res.render('admin/balance', {
      title: 'Balanço Financeiro - Bibly',
      activePage: 'balance',
      user: req.session.user,
      records,
      totalBalance: totalBalance.toFixed(2),
      filters: { startDate, endDate }
    });
  } catch (error) {
    console.error('Erro ao carregar balanço:', error);
    res.status(500).send('Erro interno ao carregar o balanço.');
  }
}

module.exports = { list };