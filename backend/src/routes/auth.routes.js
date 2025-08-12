const {Router} = require('express');
const AuthController = require('../controllers/AuthController');
const auth = require('../configs/auth');

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/register', authController.register);
authRoutes.post('/verify', authController.verifyEmail);
authRoutes.post('/resend', authController.resendVerificationCode);
authRoutes.post('/login', authController.login);
authRoutes.post('/google/verify', authController.verifyGoogleUser);
authRoutes.get('/confirm/email', authController.confirmEmailToken);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         is_verified:
 *           type: boolean
 *         gooogle_id:
 *           type: string
 *           nullable: true
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tokenToVerify:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: Verifica o email do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               verificationCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verificado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: {}
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /auth/resend:
 *   post:
 *     summary: Reenvia o código de verificação para o email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Código reenviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tokenToVerify:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 expiresIn:
 *                   type: string
 *                   format: date-time
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /auth/google/verify:
 *   post:
 *     summary: Verifica usuário via Google OAuth
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário autenticado via Google
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 expiresIn:
 *                   type: string
 *                   format: date-time
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /auth/confirm/email:
 *   get:
 *     summary: Confirma o token de email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de verificação
 *     responses:
 *       200:
 *         description: Email confirmado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *       400:
 *         description: Token inválido
 */


module.exports = authRoutes;
