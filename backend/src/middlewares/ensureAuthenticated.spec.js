const ensureAuthenticated = require('./ensureAuthenticated');
const { sign } = require('jsonwebtoken');
const AppError = require('../utils/AppError');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

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

  it('deve permitir acesso com token válido', () => {
    const token = sign({ user: '1' }, process.env.JWT_SECRET, { subject: 'user@email.com' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    ensureAuthenticated(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(req.user).toBe('user@email.com');
  });

  it('deve lançar erro se não houver token', () => {
    const req = { headers: {} };
    const res = mockRes();
    expect(() => ensureAuthenticated(req, res, mockNext)).toThrow(AppError);
  });

  it('deve lançar erro se o token for inválido', () => {
    const req = { headers: { authorization: 'Bearer tokeninvalido' } };
    const res = mockRes();
    expect(() => ensureAuthenticated(req, res, mockNext)).toThrow(AppError);
  });

  it('deve lançar erro se o token for mal formatado', () => {
    const req = { headers: { authorization: 'tokensemBearer' } };
    const res = mockRes();
    expect(() => ensureAuthenticated(req, res, mockNext)).toThrow(AppError);
  });

  it('deve lançar erro se o token estiver expirado', () => {
    const expiredToken = sign({}, process.env.JWT_SECRET, { subject: 'user@email.com', expiresIn: -10 });
    const req = { headers: { authorization: `Bearer ${expiredToken}` } };
    const res = mockRes();
    expect(() => ensureAuthenticated(req, res, mockNext)).toThrow(AppError);
  });

  it('deve lançar erro se o token não tiver subject', () => {
    const token = sign({}, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    expect(() => ensureAuthenticated(req, res, mockNext)).toThrow(AppError);
  });

  it('deve permitir acesso com subject numérico', () => {
    const token = sign({}, process.env.JWT_SECRET, { subject: '42' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    ensureAuthenticated(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(req.user).toBe('42');
  });
});
