const express = require('express');
const booksController = require('../controllers/booksController');
const router = express.Router();

function requireAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/login');
}

router.get('/', booksController.list);
router.get('/novo', requireAdmin, booksController.newForm);
router.post('/', requireAdmin, booksController.create);
router.get('/:id', booksController.showDetail);
router.post('/:id/editar', requireAdmin, booksController.update);

module.exports = router;