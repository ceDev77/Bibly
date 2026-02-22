const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balanceController');

router.get('/admin/balanco', balanceController.list);

module.exports = router;