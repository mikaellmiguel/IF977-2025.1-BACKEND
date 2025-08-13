const {Router} = require('express');
const ReferenciasController = require('../controllers/ReferenciasController');

const referenciasController = new ReferenciasController();
const referenciasRoutes = Router();

referenciasRoutes.get('/despesas', referenciasController.getReferenciasDespesas);
referenciasRoutes.get('/deputados', referenciasController.getReferenciasDeputados);

/**
 * @swagger
 * components:
 *   schemas:
 *     ReferenciasDespesas:
 *       type: object
 *       properties:
 *         tipos:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de tipos de despesas
 *         estados:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de siglas de estados
 *     ReferenciasDeputados:
 *       type: object
 *       properties:
 *         estados:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de siglas de estados
 *         partidos:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de partidos
 *
 * /referencias/despesas:
 *   get:
 *     summary: Lista tipos de despesas e estados disponíveis
 *     tags: [Referencias]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID do deputado (opcional)
 *     responses:
 *       200:
 *         description: Tipos de despesas e estados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReferenciasDespesas'
 *
 * /referencias/deputados:
 *   get:
 *     summary: Lista estados e partidos disponíveis
 *     tags: [Referencias]
 *     responses:
 *       200:
 *         description: Estados e partidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReferenciasDeputados'
 */

module.exports = referenciasRoutes;