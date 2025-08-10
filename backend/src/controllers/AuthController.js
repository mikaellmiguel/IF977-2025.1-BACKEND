const AppError = require("../utils/AppError");
const {hash, compare} = require("bcryptjs");
const generateVerificationCode = require("../utils/generateVerificationCode");
const generateExpiration = require("../utils/generateExpiration");
const knex = require("../database/knex");
const authConfig = require("../configs/auth");
const {sign, verify} = require("jsonwebtoken");
const enviarCodigoPorEmail = require("../utils/enviarCodigoPorEmail");
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const validarEmail = require("../utils/validarEmail");


class AuthController {

    async register(request, response) {
        const {name, email, password} = request.body;

        if (!name || !email || !password) {
            throw new AppError("Nome, email e senha são obrigatórios", 400);
        }

        if (validarEmail(email) === false) throw new AppError("Email inválido", 400);
        const existingUser = await knex("users").where({ email }).first();

        if(existingUser) throw new AppError("Email já cadastrado", 400);

        const hashedPassword = await hash(password, 8);
        const verificationCode = generateVerificationCode();
        const codeExpiration = generateExpiration(10);

        const trx = await knex.transaction();
        
        try {
            await trx("users").insert({name, email, password: hashedPassword, verification_code: verificationCode, code_expiration: codeExpiration});
            const tokenToVerify = sign({}, process.env.JWT_SECRET, {
                subject: email
            });
            await enviarCodigoPorEmail(email, verificationCode, tokenToVerify);
            await trx.commit();
            return response.status(201).json({ tokenToVerify });
        } catch (error) {
            await trx.rollback(); // Reverte a transação em caso de erro
            throw error;
        }
    }
}

module.exports = AuthController;
