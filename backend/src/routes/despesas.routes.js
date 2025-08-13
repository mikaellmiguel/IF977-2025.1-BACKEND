const {Router} = require('express');
const DespesasController = require('../controllers/DespesasController');

const despesasRoutes = Router();
const despesasController = new DespesasController();

despesasRoutes.get("/deputados/:deputado_id", despesasController.index);
despesasRoutes.get("/ranking", despesasController.ranking);
despesasRoutes.get("/statistics", despesasController.statistics);


/**
 * @swagger
 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 * components:
 *   schemas:
 *     Despesa:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         id_deputado:
 *           type: integer
 *         sigla_uf:
 *           type: string
 *         descricao:
 *           type: string
 *         fornecedor:
 *           type: string
 *         valor_documento:
 *           type: number
 *           format: float
 *         data_emissao:
 *           type: string
 *           format: date-time
 *         url_documento:
 *           type: string
 *           nullable: true
 *     RankingDeputado:
 *       type: object
 *       properties:
 *         id_deputado:
 *           type: integer
 *           description: ID do deputado
 *         nome:
 *           type: string
 *           description: Nome do deputado
 *         partido:
 *           type: string
 *           description: Sigla do partido
 *         sigla_uf:
 *           type: string
 *           description: Sigla do estado
 *         total_despesas:
 *           type: integer
 *           description: Quantidade de despesas
 *         total_valores:
 *           type: number
 *           description: Valor total das despesas
 *
 * /despesas/deputados/{deputado_id}:
 *   get:
 *     summary: Lista despesas de um deputado
 *     tags: [Despesas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deputado_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do deputado
 *       - in: query
 *         name: valor_min
 *         schema:
 *           type: number
 *         description: Valor mínimo
 *       - in: query
 *         name: valor_max
 *         schema:
 *           type: number
 *         description: Valor máximo
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *         description: Tipo de despesa
 *       - in: query
 *         name: uf
 *         schema:
 *           type: string
 *         description: Sigla da UF
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número máximo de registros
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Posição inicial dos registros
 *     responses:
 *       200:
 *         description: Lista de despesas do deputado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Despesa'
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *       401:
 *         description: Não autenticado
 *
 * /despesas/ranking:
 *   get:
 *     summary: Ranking de despesas dos deputados
 *     tags: [Despesas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número máximo de registros
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Posição inicial dos registros
 *     responses:
 *       200:
 *         description: Ranking de despesas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RankingDeputado'
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *       401:
 *         description: Não autenticado
 *
 * /despesas/statistics:
 *   get:
 *     summary: Estatísticas de despesas
 *     tags: [Despesas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: deputado_id
 *         schema:
 *           type: integer
 *         description: ID do deputado
 *       - in: query
 *         name: mes
 *         schema:
 *           type: integer
 *         description: Mês
 *       - in: query
 *         name: ano
 *         schema:
 *           type: integer
 *         description: Ano
 *       - in: query
 *         name: partido
 *         schema:
 *           type: string
 *         description: Sigla do partido
 *       - in: query
 *         name: uf
 *         schema:
 *           type: string
 *         description: Sigla da UF
 *     responses:
 *       200:
 *         description: Estatísticas de despesas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_despesas:
 *                   type: integer
 *                 total_valores:
 *                   type: number
 *                 ticket_medio:
 *                   type: number
 *                 gastos_por_mes:
 *                   type: array
 *                   items:
 *                     type: object
 *                 gastos_por_ano:
 *                   type: array
 *                   items:
 *                     type: object
 *                 gastos_por_tipo:
 *                   type: array
 *                   items:
 *                     type: object
 *                 top_fornecedores:
 *                   type: array
 *                   items:
 *                     type: object
 *                 despesa_por_partido:
 *                   type: array
 *                   items:
 *                     type: object
 *                 despesa_por_estado:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Não autenticado
 */


module.exports = despesasRoutes;