const {Router} = require('express');

const usersRouter = Router();
const UsersController = require('../controllers/UsersController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const usersController = new UsersController();
usersRouter.put('/', usersController.update);
usersRouter.delete('/', usersController.delete);

/**
 * @swagger
 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 * components:
 *   schemas:
 *     UserUpdateRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         old_password:
 *           type: string
 *     UserDeleteRequest:
 *       type: object
 *       properties:
 *         password:
 *           type: string
 *     UserUpdateResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Usuário atualizado com sucesso
 *
 * /users:
 *   put:
 *     summary: Atualiza dados do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateRequest'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserUpdateResponse'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *
 *   delete:
 *     summary: Exclui o usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDeleteRequest'
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 */

module.exports = usersRouter;