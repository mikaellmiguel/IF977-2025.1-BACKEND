const mockKnexInstance = {
  where: jest.fn().mockReturnThis(),
  first: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

jest.mock('../database/knex', () => jest.fn((tableName) => mockKnexInstance));
const UsersController = require('./UsersController');
const AppError = require('../utils/AppError');
const knex = require('../database/knex');

jest.mock('bcryptjs', () => ({
    hash: jest.fn(async () => 'hashed'),
    compare: jest.fn()
}));
const bcrypt = require('bcryptjs');

const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('UsersController', () => {
    let controller;
    beforeEach(() => {
        controller = new UsersController();
        jest.clearAllMocks();
    });

    describe('update', () => {
        it('deve atualizar nome e e-mail', async () => {
        mockKnexInstance.first.mockResolvedValue({ id: 1 });
        mockKnexInstance.update.mockResolvedValue(1);
        const req = { user: 1, body: { name: 'Novo Nome', email: 'novo@email.com' } };
        const res = mockResponse();
        await controller.update(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usuário atualizado com sucesso' });
        });
        it('deve lançar erro se usuário não existir', async () => {
        mockKnexInstance.first.mockResolvedValue(null);
        const req = { user: 1, body: { name: 'Novo Nome', email: 'novo@email.com' } };
        const res = mockResponse();
        await expect(controller.update(req, res)).rejects.toThrow(AppError);
        });
        it('deve atualizar apenas o nome', async () => {
        mockKnexInstance.first.mockResolvedValue({ id: 1 });
        mockKnexInstance.update.mockResolvedValue(1);
        const req = { user: 1, body: { name: 'Novo Nome' } };
        const res = mockResponse();
        await controller.update(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usuário atualizado com sucesso' });
        });
        it('deve atualizar apenas o e-mail', async () => {
        mockKnexInstance.first.mockResolvedValue({ id: 1 });
        mockKnexInstance.update.mockResolvedValue(1);
        const req = { user: 1, body: { email: 'novo@email.com' } };
        const res = mockResponse();
        await controller.update(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usuário atualizado com sucesso' });
        });
    it('deve retornar 200 se nenhum dado for enviado', async () => {
    mockKnexInstance.first.mockResolvedValue({ id: 1 });
    const req = { user: 1, body: {} };
    const res = mockResponse();
    await controller.update(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    });
    });

    describe('delete', () => {
        it('deve deletar usuário existente', async () => {
            mockKnexInstance.first.mockResolvedValue({ id: 1, password: 'hash' });
            mockKnexInstance.delete.mockResolvedValue(1);
            bcrypt.compare.mockResolvedValue(true);
            const req = { user: 1, body: { password: 'senha' } };
            const res = mockResponse();
            await controller.delete(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
            // O controller retorna apenas status 200 sem mensagem, então aceita undefined
            expect(res.json.mock.calls[0][0]).toBeUndefined();
        });
        it('deve lançar erro se usuário não existir', async () => {
            mockKnexInstance.first.mockResolvedValue(null);
            const req = { user: 1, body: { password: 'senha' } };
            const res = mockResponse();
            await expect(controller.delete(req, res)).rejects.toThrow(AppError);
        });
        it('deve deletar usuário com senha correta', async () => {
            mockKnexInstance.first.mockResolvedValue({ id: 1, password: 'hash' });
            mockKnexInstance.delete.mockResolvedValue(1);
            bcrypt.compare.mockResolvedValue(true);
            const req = { user: 1, body: { password: 'senha' } };
            const res = mockResponse();
            await controller.delete(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
            expect(res.json.mock.calls[0][0]).toBeUndefined();
        });
        it('deve lançar erro se senha não informada', async () => {
            const req = { user: 1, body: {} };
            const res = mockResponse();
            await expect(controller.delete(req, res)).rejects.toThrow('Senha não informada');
        });
        it('deve lançar erro se usuário não encontrado', async () => {
            mockKnexInstance.first.mockResolvedValue(null);
            const req = { user: 1, body: { password: 'senha' } };
            const res = mockResponse();
            await expect(controller.delete(req, res)).rejects.toThrow('Usuário não encontrado');
        });
        it('deve lançar erro se senha estiver incorreta', async () => {
            mockKnexInstance.first.mockResolvedValue({ id: 1, password: 'hash' });
            bcrypt.compare.mockResolvedValue(false);
            const req = { user: 1, body: { password: 'errada' } };
            const res = mockResponse();
            await expect(controller.delete(req, res)).rejects.toThrow(AppError);
        });
    });
});