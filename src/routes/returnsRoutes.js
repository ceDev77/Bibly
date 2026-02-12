const express = require('express');
const returnsController = require('../controllers/returnsController');

const router = express.Router();

router.get('/', returnsController.index);

module.exports = router;
