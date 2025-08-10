const {Router} = require('express');
const DeputadosController = require('../controllers/DeputadosController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const deputadosRoutes = Router();
const deputadosController = new DeputadosController();

// Rota para buscar todos os deputados com paginação
deputadosRoutes.get('/', deputadosController.index);
deputadosRoutes.get('/search', deputadosController.search);
deputadosRoutes.get('/:id', ensureAuthenticated, deputadosController.show);

module.exports = deputadosRoutes;