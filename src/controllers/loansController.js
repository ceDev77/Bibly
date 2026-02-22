const { getDb } = require('../models/database');

async function create(req, res) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  
  try {
    const { bookId, weeks } = req.body;
    const userId = req.session.user.id;
    const db = await getDb();
    const weeksInt = parseInt(weeks) || 1;
    const totalPrice = weeksInt * 5.00;

    const result = await db.run(
      `INSERT INTO loans (user_id, book_id, loan_date, weeks, total_price, status) 
       VALUES (?, ?, date('now'), ?, ?, 'em aberto')`,
      [userId, bookId, weeksInt, totalPrice]
    );

    const loanId = result.lastID;

    await db.run('UPDATE books SET stock = stock - 1 WHERE id = ?', [bookId]);
    const book = await db.get('SELECT * FROM books WHERE id = ?', [bookId]);

    res.render('book-details', {
      book,
      user: req.session.user,
      loanId: loanId,
      success: 'Empréstimo solicitado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao criar empréstimo:', error);
    res.status(500).send("Erro ao processar empréstimo.");
  }
}

async function list(req, res) {
  try {
    const db = await getDb();
    const user = req.session.user;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!user || user.name === 'Visitante') {
      return res.render('loans', {
        title: 'Empréstimos - Bibly',
        activePage: 'loans',
        user: user || { name: 'Visitante', role: 'guest' },
        loans: []
      });
    }

    let query = `
      SELECT loans.*, users.name as user_name, books.title as book_title
      FROM loans
      JOIN users ON loans.user_id = users.id
      JOIN books ON loans.book_id = books.id
    `;
    let params = [];

    if (user.role !== 'admin') {
      query += ` WHERE loans.user_id = ?`;
      params.push(user.id);
    }

    query += ` ORDER BY loans.id DESC`;

    const loansRaw = await db.all(query, params);

    const loansMapped = loansRaw.map(loan => {
      const loanDate = new Date(loan.loan_date);
      loanDate.setHours(0, 0, 0, 0);

      const dueDate = new Date(loanDate);
      dueDate.setDate(loanDate.getDate() + (loan.weeks * 7));
      dueDate.setHours(0, 0, 0, 0);

      let currentStatus = loan.status;
      let fineValue = 0;

      if (currentStatus === 'fechado') {
        fineValue = loan.final_fine || 0;
      } else if (today > dueDate) {
        currentStatus = 'vencido';
        const diffTime = today.getTime() - dueDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        fineValue = diffDays * 2.00;
      }

      return {
        ...loan,
        status: currentStatus,
        due_date: dueDate.toLocaleDateString('pt-BR'),
        loan_date: loanDate.toLocaleDateString('pt-BR'),
        fine: fineValue.toFixed(2).replace('.', ',')
      };
    });

    res.render('loans', {
      title: 'Empréstimos - Bibly',
      activePage: 'loans',
      user: user,
      loans: loansMapped
    });
  } catch (error) {
    console.error('Erro ao listar empréstimos:', error);
    res.status(500).send("Erro ao carregar empréstimos.");
  }
}

async function closeLoan(req, res) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  
  try {
    const { id } = req.params;
    const db = await getDb();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const loan = await db.get(`
      SELECT loans.*, users.name as user_name 
      FROM loans 
      JOIN users ON loans.user_id = users.id 
      WHERE loans.id = ?
    `, [id]);

    if (!loan) return res.redirect('/emprestimos');
    
    if (loan.user_id !== req.session.user.id && req.session.user.role !== 'admin') {
      return res.status(403).send("Acesso negado");
    }

    const loanDate = new Date(loan.loan_date);
    const dueDate = new Date(loanDate);
    dueDate.setDate(loanDate.getDate() + (loan.weeks * 7));
    
    let finalFine = 0;
    if (today > dueDate) {
      const diffTime = today.getTime() - dueDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      finalFine = diffDays * 2.00;
    }

    await db.run(
      `UPDATE loans SET status = "fechado", closed_at = date('now'), final_fine = ? WHERE id = ?`, 
      [finalFine, id]
    );

    await db.run(
      `INSERT INTO balance (loan_id, user_name, amount, received_at) 
       VALUES (?, ?, ?, date('now'))`,
      [id, loan.user_name, loan.total_price + finalFine]
    );

    await db.run('UPDATE books SET stock = stock + 1 WHERE id = ?', [loan.book_id]);
    res.redirect('/emprestimos');
  } catch (error) {
    console.error('Erro ao fechar empréstimo:', error);
    res.status(500).send("Erro ao fechar empréstimo.");
  }
}

module.exports = { list, create, closeLoan };