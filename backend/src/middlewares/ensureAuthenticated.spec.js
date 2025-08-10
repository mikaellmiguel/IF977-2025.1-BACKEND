jest.mock('../database/knex', () => jest.fn((tableName) => mockKnexInstance));
const mockKnexInstance = {
  where: jest.fn().mockReturnThis(),
  first: jest.fn()
};
jest.mock('../configs/auth', () => ({
  jwt: {
    secret: 'testsecret',
    expiresIn: '1d'
  }
}));
const ensureAuthenticated = require('./ensureAuthenticated');
const { sign } = require('jsonwebtoken');
const AppError = require('../utils/AppError');

process.env.JWT_SECRET =  'testsecret';

const mockNext = jest.fn();
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('ensureAuthenticated', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve permitir acesso com token válido', async () => {
    mockKnexInstance.first.mockResolvedValue({ id: 'user@email.com' });
    const token = sign({}, process.env.JWT_SECRET, { subject: 'user@email.com' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    await ensureAuthenticated(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(req.user).toBe('user@email.com');
  });

  it('deve lançar erro se não houver token', async () => {
    const req = { headers: {} };
    const res = mockRes();
    await expect(ensureAuthenticated(req, res, mockNext)).rejects.toThrow('JWT token não informado');
  });

  it('deve lançar erro se o token for inválido', async () => {
    const req = { headers: { authorization: 'Bearer tokeninvalido' } };
    const res = mockRes();
    await expect(ensureAuthenticated(req, res, mockNext)).rejects.toThrow('JWT token inválido');
  });

  it('deve lançar erro se o token for mal formatado', async () => {
    const req = { headers: { authorization: 'tokensemBearer' } };
    const res = mockRes();
    await expect(ensureAuthenticated(req, res, mockNext)).rejects.toThrow('JWT token inválido');
  });

  it('deve lançar erro se o token estiver expirado', async () => {
    const expiredToken = sign({}, process.env.JWT_SECRET, { subject: 'user@email.com', expiresIn: -10 });
    const req = { headers: { authorization: `Bearer ${expiredToken}` } };
    const res = mockRes();
    await expect(ensureAuthenticated(req, res, mockNext)).rejects.toThrow('JWT token inválido');
  });

  it('deve lançar erro se o token não tiver subject', async () => {
    const token = sign({}, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    await expect(ensureAuthenticated(req, res, mockNext)).rejects.toThrow('JWT token inválido');
  });

  it('deve permitir acesso com subject numérico', async () => {
    mockKnexInstance.first.mockResolvedValue({ id: '42' });
    const token = sign({}, process.env.JWT_SECRET, { subject: '42' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    await ensureAuthenticated(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(req.user).toBe('42');
  });
  it('deve lançar erro se usuário não existir', async () => {
    mockKnexInstance.first.mockResolvedValue(null);
    const token = sign({}, process.env.JWT_SECRET, { subject: 'user@email.com' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    await expect(ensureAuthenticated(req, res, mockNext)).rejects.toThrow(AppError);
  });
});
