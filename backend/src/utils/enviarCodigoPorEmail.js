require('dotenv').config();

const nodemailer = require('nodemailer');
const mensagemVerificacaoEmail = require('./mensagemVerificacaoEmail');

async function enviarCodigoPorEmail(email, codigo, token, nome = '') {
    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE_EMAIL,
        auth: {
            user: process.env.SERVICE_EMAIL_USER,
            pass: process.env.SERVICE_EMAIL_PASSWORD
        }
    });

    const url = `${process.env.FRONTEND_URL}/verify?token=${encodeURIComponent(token)}`;
    const mensagem = mensagemVerificacaoEmail({ nome, codigo, url });

    const mailOptions = {
        from: process.env.SERVICE_EMAIL_NAME,
        to: email,
        subject: 'Código de Verificação - FiscalizaDeputado',
        html: mensagem
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Erro ao enviar e-mail');
    }
}

module.exports = enviarCodigoPorEmail;