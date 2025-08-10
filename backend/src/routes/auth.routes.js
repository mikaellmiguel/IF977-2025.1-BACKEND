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


module.exports = authRoutes;
