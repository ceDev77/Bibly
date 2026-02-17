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
    const { fullName, email, phone, cpf, birthDate, address, password, confirmPassword } = req.body;
    
    const reloadWithError = (message) => {
      return res.render('users-new', {
        title: 'Novo Usuário - Bibly',
        activePage: 'users-new',
        user: req.session.user || { name: 'Visitante', role: 'guest' },
        error: message,
        formData: req.body 
      });
    };

    if (!fullName || !email || !phone || !cpf || !birthDate || !address || !password || !confirmPassword) {
      return reloadWithError('Todos os campos são obrigatórios');
    }
    
    if (password !== confirmPassword) {
      return reloadWithError('As senhas não coincidem');
    }
    
    const db = await getDb();
    
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return reloadWithError('E-mail já cadastrado');
    }
    
    const existingCPF = await db.get('SELECT id FROM users WHERE cpf = ?', [cpf]);
    if (existingCPF) {
      return reloadWithError('CPF já cadastrado');
    }
    
    await db.run(
      `INSERT INTO users (name, email, phone, cpf, birthDate, address, password, role, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'user', datetime('now'), datetime('now'))`,
      [fullName, email, phone, cpf, birthDate, address, password]
    );
    
    res.render('login', { 
        title: 'Login - Bibly',
        success: 'Conta criada com sucesso! Faça login para continuar.' 
    });
    
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.render('users-new', {
      title: 'Novo Usuário - Bibly',
      activePage: 'users-new',
      error: 'Erro interno ao processar cadastro'
    });
  }
}

async function adminUsers(req, res) {
  try {
    const db = await getDb();
    const users = await db.all('SELECT id, name, email, cpf, phone, role FROM users ORDER BY id DESC');
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

async function showDetail(req, res) {
  try {
    const { id } = req.params;
    const db = await getDb();
    const userDetail = await db.get('SELECT id, name, email, role, phone, cpf, birthDate, address FROM users WHERE id = ?', [id]);

    if (!userDetail) {
      return res.status(404).send("Usuário não encontrado.");
    }

    res.render('admin/user-details', {
      title: `Perfil de ${userDetail.name} - Bibly`,
      activePage: 'users',
      user: req.session.user, 
      targetUser: userDetail 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar detalhes do usuário.");
  }
}

async function showMyInfo(req, res) {
  try {
    const db = await getDb();
    const userInfo = await db.get('SELECT id, name, email, role, phone, cpf, birthDate, address FROM users WHERE id = ?', [req.session.user.id]);
    res.render('my-info', {
      title: 'Minhas Informações - Bibly',
      activePage: 'profile',
      user: req.session.user,
      userInfo: userInfo
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar perfil.");
  }
}

async function updateMyInfo(req, res) {
  try {
    const { name, phone, birthDate, address, password, confirmPassword } = req.body;
    const db = await getDb();
    const userId = req.session.user.id;

    if (password) {
      if (password !== confirmPassword) {
        const userInfo = await db.get('SELECT id, name, email, role, phone, cpf, birthDate, address FROM users WHERE id = ?', [userId]);
        return res.render('my-info', {
          title: 'Minhas Informações - Bibly',
          activePage: 'profile',
          user: req.session.user,
          userInfo: userInfo,
          error: 'As senhas não coincidem!'
        });
      }

      await db.run(
        `UPDATE users SET name = ?, phone = ?, birthDate = ?, address = ?, password = ?, updatedAt = datetime('now') WHERE id = ?`,
        [name, phone, birthDate, address, password, userId]
      );
    } else {
      await db.run(
        `UPDATE users SET name = ?, phone = ?, birthDate = ?, address = ?, updatedAt = datetime('now') WHERE id = ?`,
        [name, phone, birthDate, address, userId]
      );
    }

    const updatedUser = await db.get('SELECT id, name, email, role, phone, cpf, birthDate, address FROM users WHERE id = ?', [userId]);
    req.session.user.name = updatedUser.name;

    res.render('my-info', {
      title: 'Minhas Informações - Bibly',
      activePage: 'profile',
      user: req.session.user,
      userInfo: updatedUser,
      success: 'Suas informações foram atualizadas com sucesso!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao atualizar suas informações.");
  }
}

module.exports = {
  renderNewForm,
  create,
  adminUsers,
  showDetail,
  showMyInfo,
  updateMyInfo
};