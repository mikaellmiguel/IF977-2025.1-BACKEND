const DeputadosController = require('./DeputadosController');
const { getDetailsDeputadoById } = require('../services/camara.service');
const AppError = require('../utils/AppError');
const { distinct } = require('../database/knex');

jest.mock('../services/camara.service');


const mockKnexInstance = {
    count: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    select: jest.fn(),
    first: jest.fn(),
    distinct: jest.fn(),
    where: jest.fn().mockReturnThis(),
    clone: jest.fn().mockReturnThis()
};


// Considerando que erros de validação de partido e sigla de UF são tratados em métodos separados,
jest.mock('../utils/validarPartido', () => jest.fn(async () => true));
jest.mock('../utils/validarSiglaUf', () => jest.fn(async () => true));
jest.mock('../utils/validarIdDeputado', () => jest.fn());


jest.mock("../database/knex", () => jest.fn((tableName) => mockKnexInstance)) ;

describe('DeputadosController', () => {
    let request, response;

    describe('Metodo show', () => {

        beforeEach(() => {
            jest.clearAllMocks();
            request = { params: { id: '204555' } };
            response = { json: jest.fn() };
        });

        
        it('deve retornar os dados do deputado quando encontrado', async () => {
            const mockDeputado = { id: 204555, nome: 'Marcos Pereira', isFollowing: false };
            const validarIdDeputado = require('../utils/validarIdDeputado');
            validarIdDeputado.mockResolvedValue(true);
            getDetailsDeputadoById.mockResolvedValue(mockDeputado);
            const controller = new DeputadosController();
            await controller.show(request, response);
            expect(validarIdDeputado).toHaveBeenCalledWith('204555');
            expect(getDetailsDeputadoById).toHaveBeenCalledWith('204555');
            expect(response.json).toHaveBeenCalledWith(mockDeputado);
        });

        it('deve propagar erro se validarIdDeputado lançar erro', async () => {
            const validarIdDeputado = require('../utils/validarIdDeputado');
            const error = new AppError('ID inválido', 400);
            validarIdDeputado.mockRejectedValue(error);
            getDetailsDeputadoById.mockResolvedValue({}); // Evita chamada real
            const controller = new DeputadosController();
            try {
                await controller.show(request, response);
            } catch (err) {
                expect(err).toBeInstanceOf(AppError);
                expect(err.message).toBe('ID inválido');
                expect(err.statusCode).toBe(400);
            }
        });

        it('deve propagar erro se getDetailsDeputadoById lançar erro', async () => {
            const validarIdDeputado = require('../utils/validarIdDeputado');
            validarIdDeputado.mockResolvedValue(true);
            const error = new AppError('Deputado não encontrado', 400);
            getDetailsDeputadoById.mockRejectedValue(error);
            const controller = new DeputadosController();
            try {
                await controller.show(request, response);
            } catch (err) {
                expect(err).toBeInstanceOf(AppError);
                expect(err.message).toBe('Deputado não encontrado');
                expect(err.statusCode).toBe(400);
            }
        });
    
    });

    describe("Metodo search", () => {
        afterEach(() => {
            mockKnexInstance.count.mockReturnThis();
        });

        let controller;
        let response;
        beforeEach(() => {
            controller = new DeputadosController();
            response = { json: jest.fn() };
            jest.clearAllMocks();
        });

        it('deve retornar deputados filtrando por nome', async () => {
            mockKnexInstance.count.mockReturnThis();
            mockKnexInstance.first.mockResolvedValue({ total: 1 });
            mockKnexInstance.orderBy.mockReturnThis();
            mockKnexInstance.where = jest.fn().mockReturnThis();
            mockKnexInstance.select.mockResolvedValue([
                { id: 1, nome: 'Deputado 1', partido: 'ABC', sigla_uf: 'PE' }
            ]);
            const request = { query: { name: 'Deputado 1' } };
            await controller.search(request, response);
            expect(mockKnexInstance.where).toHaveBeenCalledWith('nome', 'like', '%Deputado 1%');
            expect(response.json).toHaveBeenCalledWith({
                dados: [ { id: 1, nome: 'Deputado 1', partido: 'ABC', sigla_uf: 'PE' } ],
                total: 1,
                limit: 20,
                offset: 0
            });
        });

        it('deve lançar erro se limit ou offset forem inválidos', async () => {
            const request = { query: { limit: 'abc', offset: '0' } };
            try {
                await controller.search(request, response);
            } catch (err) {
                expect(err).toBeInstanceOf(AppError);
                expect(err.message).toBe("Parâmetros 'limit' e 'offset' devem ser números inteiros positivos");
                expect(err.statusCode).toBe(400);
            }
        });

        it('deve filtrar por partido e chamar validarPartido', async () => {
            mockKnexInstance.count.mockReturnThis();
            mockKnexInstance.first.mockResolvedValue({ total: 1 });
            mockKnexInstance.orderBy.mockReturnThis();
            mockKnexInstance.where = jest.fn().mockReturnThis();
            mockKnexInstance.select.mockResolvedValue([
                { id: 2, nome: 'Deputado 2', partido: 'PT', sigla_uf: 'PE' }
            ]);
            mockKnexInstance.select.mockImplementation(() => Promise.resolve([
                { id: 2, nome: 'Deputado 2', partido: 'PT', sigla_uf: 'PE' }
            ]));
            mockKnexInstance.first.mockResolvedValue({ total: 1 });
            const request = { query: { partido: 'PT' } };
            await controller.search(request, response);
            expect(response.json).toHaveBeenCalledWith({
                dados: [ { id: 2, nome: 'Deputado 2', partido: 'PT', sigla_uf: 'PE' } ],
                total: 1,
                limit: 20,
                offset: 0
            });
        });

        it('deve filtrar por uf e chamar validarSiglaUf', async () => {
            mockKnexInstance.count.mockReturnThis();
            mockKnexInstance.first.mockResolvedValue({ total: 1 });
            mockKnexInstance.orderBy.mockReturnThis();
            mockKnexInstance.where = jest.fn().mockReturnThis();
            mockKnexInstance.select.mockResolvedValue([
                { id: 3, nome: 'Deputado 3', partido: 'PSDB', sigla_uf: 'SP' }
            ]);
            const request = { query: { uf: 'SP' } };
            await controller.search(request, response);
            expect(response.json).toHaveBeenCalledWith({
                dados: [ { id: 3, nome: 'Deputado 3', partido: 'PSDB', sigla_uf: 'SP' } ],
                total: 1,
                limit: 20,
                offset: 0
            });
        });

        it('deve filtrar por nome, partido e uf juntos', async () => {
            mockKnexInstance.count.mockReturnThis();
            mockKnexInstance.first.mockResolvedValue({ total: 1 });
            mockKnexInstance.orderBy.mockReturnThis();
            mockKnexInstance.where = jest.fn().mockReturnThis();
            mockKnexInstance.select.mockResolvedValue([
                { id: 4, nome: 'Deputado 4', partido: 'PT', sigla_uf: 'PE' }
            ]);
            const request = { query: { name: 'Deputado 4', partido: 'PT', uf: 'PE' } };
            await controller.search(request, response);
            expect(response.json).toHaveBeenCalledWith({
                dados: [ { id: 4, nome: 'Deputado 4', partido: 'PT', sigla_uf: 'PE' } ],
                total: 1,
                limit: 20,
                offset: 0
            });
        });

        it('deve retornar todos os deputados se nenhum filtro for aplicado', async () => {
            mockKnexInstance.count.mockReturnThis();
            mockKnexInstance.first.mockResolvedValue({ total: 3 });
            mockKnexInstance.orderBy.mockReturnThis();
            mockKnexInstance.select.mockResolvedValue([
                { id: 5, nome: 'Deputado 1', partido: 'PMDB', sigla_uf: 'RJ' }, 
                { id: 6, nome: 'Deputado 2', partido: 'PSDB', sigla_uf: 'SP' },
                { id: 7, nome: 'Deputado 3', partido: 'PT', sigla_uf: 'PE' }
            ]);
            const request = { query: {} };
            await controller.search(request, response);
            expect(response.json).toHaveBeenCalledWith({
                dados: [
                    { id: 5, nome: 'Deputado 1', partido: 'PMDB', sigla_uf: 'RJ' },
                    { id: 6, nome: 'Deputado 2', partido: 'PSDB', sigla_uf: 'SP' },
                    { id: 7, nome: 'Deputado 3', partido: 'PT', sigla_uf: 'PE' }
                ],
                total: 3,
                limit: 20,
                offset: 0
            });
        });

    });
});