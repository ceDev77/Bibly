function index(req, res) {
  res.render('returns', {
    title: 'Devoluções - Bibly',
    activePage: 'returns',
    user: {
      name: 'Usuário',
    },
  });
}

module.exports = {
  index,
};
