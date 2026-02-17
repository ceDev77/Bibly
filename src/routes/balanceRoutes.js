const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balanceController');

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/login');
  }
  next();
}

router.get('/admin/balanco', requireAdmin, balanceController.list);

module.exports = router;