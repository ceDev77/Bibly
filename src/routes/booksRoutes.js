const express = require('express');
const booksController = require('../controllers/booksController');

const router = express.Router();

router.get('/', booksController.list);
router.get('/novo', booksController.newForm);
router.post('/', booksController.create);
router.get('/:id', booksController.showDetail);

module.exports = router;