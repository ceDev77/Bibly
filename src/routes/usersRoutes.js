const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/login');
  }
  next();
}

router.get('/usuarios/novo', usersController.renderNewForm);
router.post('/usuarios', usersController.create);
router.get('/usuarios', requireAdmin, usersController.adminUsers);
router.get('/perfil', usersController.showMyInfo);
router.post('/perfil/editar', usersController.updateMyInfo);
router.get('/usuarios/:id', requireAdmin, usersController.showDetail);

module.exports = router;