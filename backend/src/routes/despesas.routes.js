const {Router} = require('express');
const DespesasController = require('../controllers/DespesasController');

const despesasRoutes = Router();
const despesasController = new DespesasController();

despesasRoutes.get("/deputados/:deputado_id", despesasController.index);
despesasRoutes.get("/ranking", despesasController.ranking);
despesasRoutes.get("/statistics", despesasController.statistics);

module.exports = despesasRoutes;