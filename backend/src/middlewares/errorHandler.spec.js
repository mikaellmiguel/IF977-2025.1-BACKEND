const errorHandler = require('./errorHandler');
const AppError = require('../utils/AppError');

describe('errorHandler middleware', () => {
  let request, response, next;

  beforeEach(() => {
    request = {};
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('deve lidar com erros de aplicação (App Error)', () => {
    const error = new AppError('Mensagem de erro', 400);

    errorHandler(error, request, response, next);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Mensagem de erro'
    });
  });

  it('deve lidar com erros genéricos/do servidor', () => {
    const error = new Error('Erro inesperado');

    // Silencia o console.error para verificação do test
    jest.spyOn(console, 'error').mockImplementation(() => {});

    errorHandler(error, request, response, next);

    expect(console.error).toHaveBeenCalledWith(error);
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal Server Error'
    });
  });
});
