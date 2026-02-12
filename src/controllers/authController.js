function loginForm(req, res) {
  res.render('login', {
    title: 'Login - Bibly',
    activePage: 'login',
    user: {
      name: 'Usuário',
    },
  });
}

module.exports = {
  loginForm,
};
