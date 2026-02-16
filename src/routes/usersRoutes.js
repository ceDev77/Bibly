const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/login');
  }
  next();
}

router.get('/novo', usersController.renderNewForm);
router.post('/', usersController.create);
router.get('/admin/usuarios', requireAdmin, usersController.adminUsers);

module.exports = router;
