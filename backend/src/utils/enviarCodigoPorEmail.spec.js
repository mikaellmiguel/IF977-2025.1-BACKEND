const enviarCodigoPorEmail = require('./enviarCodigoPorEmail');
const nodemailer = require('nodemailer');
const mensagemVerificacaoEmail = require('./mensagemVerificacaoEmail');

jest.mock('nodemailer');
jest.mock('./mensagemVerificacaoEmail');

describe('enviarCodigoPorEmail', () => {
  const email = 'user@email.com';
  const codigo = '123456';
  const token = 'token123';
  const nome = 'Usuário <user@email.com>';
  const url = 'http://localhost/verificar-email?token=token123';

  let sendMailMock;

  beforeEach(() => {
    process.env.SERVICE_EMAIL = 'gmail';
    process.env.SERVICE_EMAIL_USER = 'test@gmail.com';
    process.env.SERVICE_EMAIL_PASSWORD = 'senha';
    process.env.SERVICE_EMAIL_NAME = 'FiscalizaDeputado <test@gmail.com>';
    process.env.FRONTEND_URL = 'http://localhost';

    sendMailMock = jest.fn().mockResolvedValue();
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
    mensagemVerificacaoEmail.mockReturnValue('<html>mensagem</html>');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve enviar e-mail com os parâmetros corretos', async () => {
    await enviarCodigoPorEmail(email, codigo, token, nome);
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: 'test@gmail.com',
        pass: 'senha'
      }
    });
    expect(mensagemVerificacaoEmail).toHaveBeenCalledWith({ nome, codigo, url });
    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'FiscalizaDeputado <test@gmail.com>',
      to: email,
      subject: 'Código de Verificação - FiscalizaDeputado',
      html: '<html>mensagem</html>'
    });
  });

  it('deve enviar e-mail mesmo sem nome', async () => {
    await enviarCodigoPorEmail(email, codigo, token);
    expect(mensagemVerificacaoEmail).toHaveBeenCalledWith({ nome: '', codigo, url });
    expect(sendMailMock).toHaveBeenCalled();
  });

  it('deve lançar erro se o envio falhar', async () => {
    sendMailMock.mockRejectedValue(new Error('Falha SMTP'));
    await expect(enviarCodigoPorEmail(email, codigo, token, nome)).rejects.toThrow('Erro ao enviar e-mail');
  });

  it('deve usar encodeURIComponent no token', async () => {
    await enviarCodigoPorEmail(email, codigo, 'token especial!@', nome);
    expect(mensagemVerificacaoEmail).toHaveBeenCalledWith({
      nome,
      codigo,
      url: 'http://localhost/verificar-email?token=token%20especial!%40'
    });
  });

  it('deve usar valores do .env corretamente', async () => {
    process.env.SERVICE_EMAIL = 'outlook';
    process.env.SERVICE_EMAIL_USER = 'outlook@email.com';
    process.env.SERVICE_EMAIL_PASSWORD = 'outrasenha';
    process.env.SERVICE_EMAIL_NAME = 'OutroNome';
    process.env.FRONTEND_URL = 'https://meusite.com';
    await enviarCodigoPorEmail(email, codigo, token, nome);
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'outlook',
      auth: {
        user: 'outlook@email.com',
        pass: 'outrasenha'
      }
    });
    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'OutroNome',
      to: email,
      subject: 'Código de Verificação - FiscalizaDeputado',
      html: '<html>mensagem</html>'
    });
  });
});
