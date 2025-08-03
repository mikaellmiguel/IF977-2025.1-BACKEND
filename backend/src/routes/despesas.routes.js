const {Router} = require('express');
const DespesasController = require('../controllers/DespesasController');

const despesasRoutes = Router();
const despesasController = new DespesasController();

despesasRoutes.get("/deputados/:deputado_id", despesasController.index);
despesasRoutes.get("/ranking", despesasController.ranking);

module.exports = despesasRoutes;