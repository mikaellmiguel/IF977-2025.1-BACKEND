const {Router} = require('express');
const FollowsController = require('../controllers/FollowsController');
const auth = require('../configs/auth');

const followsRoutes = Router();
const followsController = new FollowsController();

followsRoutes.post('/:deputado_id', followsController.create);
followsRoutes.delete('/:deputado_id', followsController.delete);
followsRoutes.get('/', followsController.index);

/**
 * @swagger
 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 * components:
 *   schemas:
 *     DeputadoSeguido:
 *       type: object
 *       properties:
 *         deputado:
 *           type: object
 *           description: Dados do deputado seguido
 *         despesasPorAno:
 *           type: object
 *           additionalProperties:
 *             type: number
 *           description: Gastos por ano (chave = ano, valor = total gasto)
 *         totalGasto:
 *           type: number
 *           description: Total gasto pelo deputado
 *
 * /follows:
 *   get:
 *     summary: Lista deputados seguidos pelo usuário autenticado
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de deputados seguidos e seus gastos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeputadoSeguido'
 *       401:
 *         description: Não autenticado
 *
 * /follows/{deputado_id}:
 *   post:
 *     summary: Seguir um deputado
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deputado_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do deputado
 *     responses:
 *       201:
 *         description: Deputado seguido com sucesso
 *       400:
 *         description: Já está seguindo
 *       404:
 *         description: Deputado não encontrado
 *       401:
 *         description: Não autenticado
 *
 *   delete:
 *     summary: Deixar de seguir um deputado
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deputado_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do deputado
 *     responses:
 *       204:
 *         description: Deputado removido dos seguidos
 *       404:
 *         description: Não está seguindo
 *       401:
 *         description: Não autenticado
 */

module.exports = followsRoutes;