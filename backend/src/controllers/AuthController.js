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

    async verifyEmail(request, response) {
        const {email, verificationCode} = request.body;

        if (!email || !verificationCode) {
            throw new AppError("Email e código de verificação são obrigatórios", 400);
        }

        const user = await knex("users").where({ email }).first();

        if(!user) throw new AppError("Usuário não encontrado", 404);
        if(user.is_verified) throw new AppError("Email já verificado", 400);
        if(user.verification_code !== verificationCode) throw new AppError("Código de verificação inválido", 400);
        if(new Date(user.code_expiration) < new Date()) throw new AppError("Código de verificação expirado", 400);
        
        await knex("users").where({ email }).update({
            is_verified: true,
            verification_code: null,
            code_expiration: null
        });

        return response.status(200).json();
    }

    async confirmEmailToken (request, response) {

        const token = request.query.token;

        if (!token) throw new AppError("Token é obrigatório", 400);

        const {secret} = authConfig.jwt;
        
        let email; 
        try {
            ({sub: email} = verify(token, secret));
        } catch {
            throw new AppError("Token inválido", 400);
        }

        if (!email) throw new AppError("Token inválido", 400);
        const user = await knex("users").where({ email }).first();

        if (!user) throw new AppError("Usuário não encontrado", 404);
        
        if(!user.is_verified) {
            return response.json({email});
        }

        throw new AppError("Email já verificado", 400);
    }

    async resendVerificationCode(request, response) {
        const {email} = request.body;

        if(!email) {
            throw new AppError("Email é obrigatório", 400);
        }

        const user = await knex("users").where({ email }).first();

        if(!user) throw new AppError("Usuário não encontrado", 404);
        if(user.is_verified) throw new AppError("Email já verificado", 400);

        const verificationCode = generateVerificationCode();
        const codeExpiration = generateExpiration(10);

        const trx = await knex.transaction();

        try {
            await trx("users").where({ email }).update({
                verification_code: verificationCode,
                code_expiration: codeExpiration
            });

            const { secret, expiresIn } = authConfig.jwt;
            const tokenToVerify = sign({}, secret, {
                subject: email,
                expiresIn
            });
            await enviarCodigoPorEmail(email, verificationCode, tokenToVerify);
            await trx.commit();
            return response.status(200).json({ tokenToVerify });
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }

    async login(request, response) {
        const {email, password} = request.body;

        if (!email || !password) {
            throw new AppError("Email e senha são obrigatórios", 400);
        }

        const user = await knex("users").where({ email }).first();

        if(!user) throw new AppError("Usuário não encontrado", 404);
        if(!user.is_verified) throw new AppError("Email não verificado", 403);

        const isPasswordValid = await compare(password, user.password);
        if(!isPasswordValid) throw new AppError("Senha incorreta", 401);

        const { secret, expiresIn } = authConfig.jwt;
        const token = sign({}, secret, {
            subject: user.email,
            expiresIn
        });

        return response.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    }
}

module.exports = AuthController;
