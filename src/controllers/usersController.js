const userModel = require('../models/userModel');

function newForm(req, res) {
  res.render('register', {
    title: 'Cadastro de Usuário - Bibly',
    activePage: 'users',
    user: {
      name: 'Usuário',
    },
  });
}

async function create(req, res) {
  const { name, email, password, role } = req.body;

  await userModel.createUser({
    name,
    email,
    password,
    role,
  });

  res.redirect('/');
}

module.exports = {
  newForm,
  create,
};
