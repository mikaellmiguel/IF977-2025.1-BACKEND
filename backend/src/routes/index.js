const {Router} = require('express');
const deputadosRoutes = require('./deputados.routes');
const despesasRoutes = require('./despesas.routes');

const routes = Router();

// Rotas para os deputados
routes.use('/deputados', deputadosRoutes);
routes.use('/despesas', despesasRoutes);

module.exports = routes;