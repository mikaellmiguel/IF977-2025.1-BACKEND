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
});
