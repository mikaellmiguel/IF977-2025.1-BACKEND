const {Router} = require('express');
const DeputadosController = require('../controllers/DeputadosController');

const deputadosRoutes = Router();
const deputadosController = new DeputadosController();

// Rota para buscar todos os deputados com paginação
deputadosRoutes.get('/:id', deputadosController.show);

module.exports = deputadosRoutes;