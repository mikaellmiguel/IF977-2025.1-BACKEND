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

