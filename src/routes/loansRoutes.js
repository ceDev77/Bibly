const express = require('express');
const loansController = require('../controllers/loansController');
const router = express.Router();

router.get('/', loansController.list);
router.post('/solicitar/:id', loansController.create);

module.exports = router;