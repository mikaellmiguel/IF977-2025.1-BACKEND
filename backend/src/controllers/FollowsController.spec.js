
const FollowsController = require('./FollowsController');
const AppError = require('../utils/AppError');


const mockKnexInstance = {
	join: jest.fn().mockReturnThis(),
	where: jest.fn().mockReturnThis(),
	select: jest.fn(),
	first: jest.fn(),
	insert: jest.fn(),
	delete: jest.fn(),
	clone: jest.fn().mockReturnThis(),
	whereIn: jest.fn().mockReturnThis(),
	sum: jest.fn().mockReturnThis(),
	groupBy: jest.fn().mockReturnThis()
};

jest.mock('../database/knex', () => jest.fn((tableName) => mockKnexInstance));
const knex = require('../database/knex');

describe('FollowsController', () => {
	let controller;
	let request;
	let response;
	beforeEach(() => {
		controller = new FollowsController();
		request = { user: 1, params: { deputado_id: 123 }, headers: {}, query: {} };
		response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
		knex.mockClear();
	});

	describe('create', () => {
		it('deve seguir deputado com sucesso', async () => {
			mockKnexInstance.where.mockReturnThis();
			mockKnexInstance.first
				.mockResolvedValueOnce(null) // followExists
				.mockResolvedValueOnce({ id: 123 }); // deputadoExists
			mockKnexInstance.insert.mockResolvedValueOnce();
			knex.mockImplementation(() => mockKnexInstance);
			await controller.create(request, response);
			expect(response.status).toHaveBeenCalledWith(201);
			expect(response.json).toHaveBeenCalled();
		});

		it('deve lançar erro se deputado não existe', async () => {
			mockKnexInstance.where.mockReturnThis();
			mockKnexInstance.first
				.mockResolvedValueOnce(null) // followExists
				.mockResolvedValueOnce(null); // deputadoExists
			knex.mockImplementation(() => mockKnexInstance);
			await expect(controller.create(request, response)).rejects.toThrow(AppError);
		});

		it('deve lançar erro se já está seguindo', async () => {
			mockKnexInstance.where.mockReturnThis();
			mockKnexInstance.first
				.mockResolvedValueOnce({ id: 1 }) // followExists
				.mockResolvedValueOnce({ id: 123 }); // deputadoExists
			knex.mockImplementation(() => mockKnexInstance);
			await expect(controller.create(request, response)).rejects.toThrow(AppError);
		});
	});

	describe('index', () => {
		it('deve retornar deputados seguidos com despesas agregadas', async () => {
			mockKnexInstance.join.mockReturnThis();
			mockKnexInstance.where.mockReturnThis();
			mockKnexInstance.select.mockResolvedValueOnce([{ id: 123, nome: 'Fulano' }]);
			mockKnexInstance.whereIn.mockReturnThis();
			mockKnexInstance.select.mockReturnThis();
			mockKnexInstance.sum.mockReturnThis();
			mockKnexInstance.groupBy.mockResolvedValueOnce([
				{ id_deputado: 123, ano: 2023, total_gasto: 100 },
				{ id_deputado: 123, ano: 2024, total_gasto: 200 }
			]);
			knex.mockImplementation(() => mockKnexInstance);
			response.json = jest.fn();
			await controller.index(request, response);
			expect(response.json).toHaveBeenCalledWith([
				{
					deputado: { id: 123, nome: 'Fulano' },
					despesasPorAno: { 2023: 100, 2024: 200 },
					totalGasto: 300
				}
			]);
		});
	});

	describe('delete', () => {
		it('deve remover follow com sucesso', async () => {
			mockKnexInstance.where.mockReturnThis();
			mockKnexInstance.first.mockResolvedValueOnce({ id: 1 });
			mockKnexInstance.delete.mockResolvedValueOnce();
			knex.mockImplementation(() => mockKnexInstance);
			response.status = jest.fn().mockReturnThis();
			response.json = jest.fn();
			await controller.delete(request, response);
			expect(response.status).toHaveBeenCalledWith(204);
			expect(response.json).toHaveBeenCalled();
		});

		it('deve lançar erro se não está seguindo', async () => {
			mockKnexInstance.where.mockReturnThis();
			mockKnexInstance.first.mockResolvedValueOnce(null);
			knex.mockImplementation(() => mockKnexInstance);
			await expect(controller.delete(request, response)).rejects.toThrow(AppError);
		});
	});
});
