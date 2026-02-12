const express = require('express');
const loansController = require('../controllers/loansController');

const router = express.Router();

router.get('/', loansController.index);

module.exports = router;
