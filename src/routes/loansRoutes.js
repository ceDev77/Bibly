const express = require('express');
const loansController = require('../controllers/loansController');
const router = express.Router();

function requireLogin(req, res, next) {
  if (!req.session.user || req.session.user.name === 'Visitante') {
    return res.redirect('/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/');
  }
  next();
}

router.get('/', loansController.list); 
router.post('/', requireLogin, loansController.create);
router.post('/:id/fechar', requireAdmin, loansController.closeLoan);

module.exports = router;