const { getDb } = require('../models/database');

async function list(req, res) {
  try {
    const db = await getDb();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!req.session.user || req.session.user.name === 'Visitante') {
      return res.render('loans', {
        title: 'Empréstimos - Bibly',
        activePage: 'loans',
        user: req.session.user || { name: 'Visitante', role: 'guest' },
        loans: []
      });
    }

    const loansRaw = await db.all(`
      SELECT loans.*, users.name as user_name, books.title as book_title
      FROM loans
      JOIN users ON loans.user_id = users.id
      JOIN books ON loans.book_id = books.id
      ORDER BY loans.id DESC
    `);

    const loans = loansRaw.map(loan => {
      const loanDate = new Date(loan.loan_date);
      loanDate.setHours(0, 0, 0, 0);

      const dueDate = new Date(loanDate);
      dueDate.setDate(loanDate.getDate() + (loan.weeks * 7));
      dueDate.setHours(0, 0, 0, 0);

      let currentStatus = loan.status;
      let fineValue = 0;

      if (currentStatus === 'fechado') {
        fineValue = loan.final_fine || 0;
      } else {
        if (today > dueDate) {
          currentStatus = 'vencido';
          const diffTime = today.getTime() - dueDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          fineValue = diffDays * 2.00; 
        } else {
          currentStatus = 'em aberto';
        }
      }

      return {
        ...loan,
        due_date: dueDate.toISOString().split('T')[0],
        status: currentStatus,
        fine_display: fineValue > 0 ? fineValue.toFixed(2) : '0,00'
      };
    });

    res.render('loans', {
      title: 'Empréstimos - Bibly',
      activePage: 'loans',
      user: req.session.user,
      loans: loans
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar lista de empréstimos.");
  }
}

async function create(req, res) {
  try {
    const { book_id, weeks } = req.body;
    const userId = req.session.user.id;
    const db = await getDb();
    const weeksInt = parseInt(weeks) || 1;
    const totalPrice = weeksInt * 5.00;

    const book = await db.get('SELECT stock FROM books WHERE id = ?', [book_id]);
    if (!book || book.stock <= 0) return res.redirect(`/livros/${book_id}?error=Livro indisponível.`);

    await db.run(
      `INSERT INTO loans (user_id, book_id, loan_date, weeks, total_price, status) 
       VALUES (?, ?, date('now'), ?, ?, 'em aberto')`,
      [userId, book_id, weeksInt, totalPrice]
    );

    await db.run('UPDATE books SET stock = stock - 1, available = CASE WHEN stock - 1 > 0 THEN 1 ELSE 0 END WHERE id = ?', [book_id]);
    res.redirect('/emprestimos');
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao processar empréstimo.");
  }
}

async function closeLoan(req, res) {
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

    if (!loan) return res.redirect('/emprestimos?error=Empréstimo não encontrado.');

    const loanDate = new Date(loan.loan_date);
    const dueDate = new Date(loanDate);
    dueDate.setDate(loanDate.getDate() + (loan.weeks * 7));
    dueDate.setHours(0, 0, 0, 0);

    let finalFine = 0;
    if (today > dueDate) {
      const diffTime = today.getTime() - dueDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      finalFine = diffDays * 2.00;
    }

    const totalReceived = loan.total_price + finalFine;

    await db.run(
      `UPDATE loans SET 
        status = "fechado", 
        closed_at = date('now'), 
        final_fine = ? 
       WHERE id = ?`, 
      [finalFine, id]
    );

    await db.run(
      `INSERT INTO balance (loan_id, user_name, amount, received_at) 
       VALUES (?, ?, ?, date('now'))`,
      [id, loan.user_name, totalReceived]
    );

    await db.run('UPDATE books SET stock = stock + 1, available = 1 WHERE id = ?', [loan.book_id]);

    res.redirect('/emprestimos?success=Empréstimo encerrado com sucesso.');
  } catch (error) {
    console.error(error);
    res.redirect('/emprestimos?error=Erro ao encerrar empréstimo.');
  }
}

module.exports = { list, create, closeLoan };