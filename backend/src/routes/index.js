const {Router} = require('express');
const deputadosRoutes = require('./deputados.routes');
const despesasRoutes = require('./despesas.routes');
const referenciasRoutes = require('./referencias.routes');
const authRoutes = require('./auth.routes');

const routes = Router();

// Rotas para os deputados
routes.use('/deputados', deputadosRoutes);
routes.use('/despesas', despesasRoutes);
routes.use('/referencias', referenciasRoutes);
routes.use('/auth', authRoutes);

module.exports = routes;