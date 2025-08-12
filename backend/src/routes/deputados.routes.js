const {Router} = require('express');
const DeputadosController = require('../controllers/DeputadosController');

const deputadosRoutes = Router();
const deputadosController = new DeputadosController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Deputado:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nome:
 *           type: string
 *         partido:
 *           type: string
 *         url_partido:
 *           type: string
 *         sigla_uf:
 *           type: string
 *         id_legislatura:
 *           type: integer
 *         url_foto:
 *           type: string
 *           nullable: true
 *         email:
 *           type: string
 *         data_nascimento:
 *           type: string
 *           format: date
 */

/**
 * @swagger
 * /deputados:
 *   get:
 *     summary: Lista todos os deputados (autenticado)
 *     tags: [Deputados]
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
 *         description: Lista de deputados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Deputado'
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *       401:
 *         description: Não autenticado
 */

/**
 * @swagger
 * /deputados/search:
 *   get:
 *     summary: Busca deputados por nome, partido ou UF (autenticado)
 *     tags: [Deputados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nome do deputado
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
 *         description: Lista de deputados filtrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Deputado'
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *       401:
 *         description: Não autenticado
 */

/**
 * @swagger
 * /deputados/{id}:
 *   get:
 *     summary: Busca detalhes de um deputado por ID (autenticado)
 *     tags: [Deputados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do deputado
 *     responses:
 *       200:
 *         description: Detalhes do deputado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome_civel:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 partido:
 *                   type: string
 *                 sigla_uf:
 *                   type: string
 *                 email:
 *                   type: string
 *                   nullable: true
 *                 telefone:
 *                   type: string
 *                   nullable: true
 *                 url_foto:
 *                   type: string
 *                   nullable: true
 *                 gabinete:
 *                   type: object
 *                   properties:
 *                     nome:
 *                       type: string
 *                       nullable: true
 *                     predio:
 *                       type: string
 *                       nullable: true
 *                     sala:
 *                       type: string
 *                       nullable: true
 *                 redes_social:
 *                   type: array
 *                   items:
 *                     type: string
 *                 escolaridade:
 *                   type: string
 *                 data_nascimento:
 *                   type: string
 *                   format: date
 *                 isFollowing:
 *                   type: boolean
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Deputado não encontrado
 */

// Rota para buscar todos os deputados com paginação
deputadosRoutes.get('/search', deputadosController.search);
deputadosRoutes.get('/:id', deputadosController.show);

module.exports = deputadosRoutes;