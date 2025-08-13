const {Router} = require('express');
const deputadosRoutes = require('./deputados.routes');
const despesasRoutes = require('./despesas.routes');
const referenciasRoutes = require('./referencias.routes');
const authRoutes = require('./auth.routes');
const usersRoutes = require("./users.routes");
const followsRoutes = require("./follows.routes");
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const routes = Router();

// Rotas para os deputados
routes.use('/deputados', ensureAuthenticated, deputadosRoutes);
routes.use('/despesas', ensureAuthenticated, despesasRoutes);
routes.use('/referencias', ensureAuthenticated, referenciasRoutes);
routes.use('/auth', authRoutes);
routes.use('/users', ensureAuthenticated, usersRoutes);
routes.use('/follows', ensureAuthenticated, followsRoutes);

module.exports = routes;