process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
const AuthController = require('./AuthController');
const AppError = require('../utils/AppError');

const { sign } = require('jsonwebtoken');
jest.mock('../database/knex', () => jest.fn((tableName) => mockKnexInstance));
jest.mock('../utils/enviarCodigoPorEmail', () => jest.fn());
jest.mock('../utils/validarEmail', () => jest.fn(() => true));
jest.mock('bcryptjs', () => ({ hash: jest.fn(async () => 'hashed'), compare: jest.fn(async () => true) }));
jest.mock('../utils/generateVerificationCode', () => jest.fn(() => '123456'));
jest.mock('../utils/generateExpiration', () => jest.fn(() => new Date(Date.now() + 600000).toISOString()));


const knex = require('../database/knex');

const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('AuthController', () => {
  let controller;
  beforeEach(() => {
    controller = new AuthController();
    jest.clearAllMocks();
  });

  describe('Método register', () => {
    it('deve cadastrar usuário e enviar e-mail', async () => {
      // Mock isolado para consulta de usuário
      const localMockKnex = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null)
      };
      knex.mockReturnValueOnce(localMockKnex);
    // Mock da transação como função chamável e métodos
    const trxObj = function() { return trxObj; };
    trxObj.insert = jest.fn().mockResolvedValue();
    trxObj.commit = jest.fn();
    trxObj.rollback = jest.fn();
    trxObj.where = jest.fn().mockReturnThis();
    knex.transaction = jest.fn().mockResolvedValue(trxObj);
        const req = { body: { name: 'User', email: 'user@email.com', password: '123456' } };
        const res = mockResponse();
        await controller.register(req, res);
        expect(trxObj.insert).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ tokenToVerify: expect.any(String) }));
      });
    it('deve lançar erro se dados obrigatórios faltarem', async () => {
      const req = { body: { name: '', email: '', password: '' } };
      const res = mockResponse();
      await expect(controller.register(req, res)).rejects.toThrow(AppError);
    });
    it('deve lançar erro se e-mail já cadastrado', async () => {
      knex.mockReturnValueOnce({ where: jest.fn().mockReturnValue({ first: jest.fn().mockResolvedValue({ email: 'user@email.com' }) }) });
      const req = { body: { name: 'User', email: 'user@email.com', password: '123456' } };
      const res = mockResponse();
      await expect(controller.register(req, res)).rejects.toThrow(AppError);
    });
  });

  describe('Método verifyEmail', () => {
    it('deve verificar e-mail com código correto', async () => {
      knex.mockReturnValueOnce({ where: jest.fn().mockReturnValue({ first: jest.fn().mockResolvedValue({ email: 'user@email.com', verification_code: '123456', is_verified: false, code_expiration: new Date(Date.now() + 600000).toISOString() }) }) });
      knex.mockReturnValueOnce({ where: jest.fn().mockReturnValue({ update: jest.fn().mockResolvedValue() }) });
      const req = { body: { email: 'user@email.com', verificationCode: '123456' } };
      const res = mockResponse();
      await controller.verifyEmail(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
    it('deve lançar erro se e-mail não existir', async () => {
      knex.mockReturnValueOnce({ where: jest.fn().mockReturnValue({ first: jest.fn().mockResolvedValue(null) }) });
      const req = { body: { email: 'user@email.com', verificationCode: '123456' } };
      const res = mockResponse();
      await expect(controller.verifyEmail(req, res)).rejects.toThrow(AppError);
    });
    it('deve lançar erro se código estiver errado', async () => {
      knex.mockReturnValueOnce({ where: jest.fn().mockReturnValue({ first: jest.fn().mockResolvedValue({ email: 'user@email.com', verification_code: '654321', is_verified: false, code_expiration: new Date(Date.now() + 600000).toISOString() }) }) });
      const req = { body: { email: 'user@email.com', verificationCode: '123456' } };
      const res = mockResponse();
      await expect(controller.verifyEmail(req, res)).rejects.toThrow(AppError);
    });
  });

  describe('Método confirmEmailToken', () => {
    it('deve retornar e-mail se token válido e não verificado', async () => {
      const secret = require('../configs/auth').jwt.secret;
      const email = 'user@email.com';
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({}, secret, { subject: email });
      knex.mockReturnValueOnce({ where: jest.fn().mockReturnValue({ first: jest.fn().mockResolvedValue({ email, is_verified: false, code_expiration: new Date(Date.now() + 600000).toISOString() }) }) });
      const req = { query: { token } };
      const res = mockResponse();
      await controller.confirmEmailToken(req, res);
      expect(res.json).toHaveBeenCalledWith({ email });
    });
    it('deve lançar erro se token inválido', async () => {
      const req = { query: { token: 'invalid' } };
      const res = mockResponse();
      await expect(controller.confirmEmailToken(req, res)).rejects.toThrow('Token inválido');
    });
  });

  describe('Método resendVerificationCode', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('deve reenviar código se usuário não verificado', async () => {
      // Mock isolado para consulta de usuário
      const localMockKnex = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ email: 'user@email.com', is_verified: false })
      };
      knex.mockReturnValueOnce(localMockKnex);
      // Mock da transação como função chamável e métodos
      const trxObj = function() { return trxObj; };
      trxObj.update = jest.fn().mockResolvedValue();
      trxObj.commit = jest.fn();
      trxObj.rollback = jest.fn();
      trxObj.where = jest.fn().mockReturnThis();
      knex.transaction = jest.fn().mockResolvedValue(trxObj);
      const req = { body: { email: 'user@email.com' } };
      const res = mockResponse();
      await controller.resendVerificationCode(req, res);
      expect(trxObj.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ tokenToVerify: expect.any(String) }));
    });
    it('deve lançar erro se usuário não existir', async () => {
      // Mock isolado para consulta de usuário inexistente
      const localMockKnex = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null)
      };
      knex.mockReturnValueOnce(localMockKnex);
      // Não precisa mockar transação, pois não será chamada
      const req = { body: { email: 'user@email.com' } };
      const res = mockResponse();
      await expect(controller.resendVerificationCode(req, res)).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('Método login', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve logar usuário verificado', async () => {
      // Mock isolado para consulta de usuário
      const localMockKnex = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ id: 1, email: 'user@email.com', name: 'User', password: 'hashed', is_verified: true })
      };
      knex.mockReturnValue(localMockKnex);
      const bcrypt = require('bcryptjs');
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      const req = { body: { email: 'user@email.com', password: '123456' } };
      const res = mockResponse();
      await controller.login(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: expect.any(String), user: expect.objectContaining({ email: 'user@email.com' }) }));
      compareSpy.mockRestore();
    });

    it('deve lançar erro se usuário não existir', async () => {
      // Mock isolado para consulta de usuário inexistente
      const localMockKnex = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(undefined)
      };
      knex.mockReturnValue(localMockKnex);
      const req = { body: { email: 'user@email.com', password: '123456' } };
      const res = mockResponse();
      await expect(controller.login(req, res)).rejects.toThrow('Usuário não encontrado');
    });

    it('deve lançar erro se usuário não verificado', async () => {
      // Mock isolado para consulta de usuário não verificado
      const localMockKnex = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ id: 1, email: 'user@email.com', name: 'User', password: 'hashed', is_verified: false })
      };
      knex.mockReturnValue(localMockKnex);
      const req = { body: { email: 'user@email.com', password: '123456' } };
      const res = mockResponse();
      await expect(controller.login(req, res)).rejects.toThrow('Email não verificado');
    });

    it('deve lançar erro se senha estiver incorreta', async () => {
      // Mock isolado para consulta de usuário verificado
      const localMockKnex = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ id: 1, email: 'user@email.com', name: 'User', password: 'hashed', is_verified: true })
      };
      knex.mockReturnValue(localMockKnex);
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(false);
      const req = { body: { email: 'user@email.com', password: 'senhaerrada' } };
      const res = mockResponse();
      await expect(controller.login(req, res)).rejects.toThrow('Senha incorreta');
    });

    it('deve lançar erro se faltar email ou senha', async () => {
      const req = { body: { email: '', password: '' } };
      const res = mockResponse();
      await expect(controller.login(req, res)).rejects.toThrow(AppError);
    });
  });
});
