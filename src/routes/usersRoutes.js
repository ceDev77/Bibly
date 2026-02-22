const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.get('/usuarios/novo', usersController.renderNewForm);
router.post('/usuarios', usersController.create);
router.get('/usuarios', usersController.adminUsers);
router.get('/perfil', usersController.showMyInfo);
router.post('/perfil/editar', usersController.updateMyInfo);
router.get('/usuarios/:id', usersController.showDetail);

module.exports = router;