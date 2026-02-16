const { findByEmail } = require('../models/userModel');

function loginForm(req, res) {
  res.render('login', {
    title: 'Login - Bibly',
    activePage: 'login',
    user: {
      name: 'Usuário',
    },
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await findByEmail(email);

    if (!user) {
      return res.render('login', {
        title: 'Login - Bibly',
        activePage: 'login',
        error: 'Usuário não encontrado',
        user: { name: 'Usuário' },
      });
    }

    if (user.password !== password) {
      return res.render('login', {
        title: 'Login - Bibly',
        activePage: 'login',
        error: 'Senha incorreta',
        user: { name: 'Usuário' },
      });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    if (user.role === 'admin') {
      return res.redirect('/');
    }

    res.redirect('/');

  } catch (error) {
    console.error('Erro no login:', error);
    res.render('login', {
      title: 'Login - Bibly',
      activePage: 'login',
      error: 'Erro ao fazer login. Tente novamente.',
      user: { name: 'Usuário' },
    });
  }
}

function logout(req, res) {
  req.session.destroy();
  res.redirect('/login');
}

module.exports = {
  loginForm,
  login,
  logout,
};
