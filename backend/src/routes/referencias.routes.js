const {Router} = require('express');
const ReferenciasController = require('../controllers/ReferenciasController');

const referenciasController = new ReferenciasController();
const referenciasRoutes = Router();

referenciasRoutes.get('/despesas', referenciasController.getReferenciasDespesas);
referenciasRoutes.get('/deputados', referenciasController.getReferenciasDeputados);

module.exports = referenciasRoutes;