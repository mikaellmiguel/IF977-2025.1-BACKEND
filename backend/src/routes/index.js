const {Router} = require('express');
const deputadosRoutes = require('./deputados.routes');

const routes = Router();

// Rotas para os deputados
routes.use('/deputados', deputadosRoutes);

module.exports = routes;