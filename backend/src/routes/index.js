const {Router} = require('express');
const deputadosRoutes = require('./deputados.routes');
const despesasRoutes = require('./despesas.routes');
const referenciasRoutes = require('./referencias.routes');
const authRoutes = require('./auth.routes');
const usersRoutes = require("./users.routes");
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const routes = Router();

// Rotas para os deputados
routes.use('/deputados', deputadosRoutes);
routes.use('/despesas', despesasRoutes);
routes.use('/referencias', referenciasRoutes);
routes.use('/auth', authRoutes);
routes.use('/users', ensureAuthenticated, usersRoutes);

module.exports = routes;