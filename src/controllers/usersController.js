const { getDb } = require('../models/database');

function renderNewForm(req, res) {
  res.render('users-new', {
    title: 'Novo Usuário - Bibly',
    activePage: 'users-new',
    user: req.session.user || { name: 'Visitante', role: 'guest' }
  });
}

async function create(req, res) {
  try {
    const { fullName, email, phone, cpf, birthDate, address, password, confirmPassword, terms } = req.body;
    
    // Basic validation
    if (!fullName || !email || !phone || !cpf || !birthDate || !address || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'As senhas não coincidem' });
    }
    
    if (!terms) {
      return res.status(400).json({ error: 'Você deve aceitar os termos de uso' });
    }
    
    const db = await getDb();
    
    // Check if email already exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }
    
    // Check if CPF already exists
    const existingCPF = await db.get('SELECT id FROM users WHERE cpf = ?', [cpf]);
    if (existingCPF) {
      return res.status(400).json({ error: 'CPF já cadastrado' });
    }
    
    // Insert new user
    await db.run(
      `INSERT INTO users (fullName, email, phone, cpf, birthDate, address, password, role, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'user', datetime('now'), datetime('now'))`,
      [fullName, email, phone, cpf, birthDate, address, password]
    );
    
    res.status(201).json({ success: 'Usuário criado com sucesso' });
    
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
}

async function adminUsers(req, res) {
  try {
    const db = await getDb();
    const users = await db.all('SELECT id, fullName, email, phone, cpf, role, createdAt FROM users ORDER BY createdAt DESC');
    
    res.render('admin/users', {
      title: 'Gerenciar Usuários - Bibly',
      activePage: 'admin-users',
      users: users,
      user: req.session.user
    });
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    res.status(500).send('Erro ao carregar usuários');
  }
}

module.exports = {
  renderNewForm,
  create,
  adminUsers
};
