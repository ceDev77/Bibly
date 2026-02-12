function index(req, res) {
  res.render('loans', {
    title: 'Empréstimos - Bibly',
    activePage: 'loans',
    user: {
      name: 'Usuário',
    },
  });
}

module.exports = {
  index,
};
