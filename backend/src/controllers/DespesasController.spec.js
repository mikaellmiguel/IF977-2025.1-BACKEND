const DespesasController = require('../controllers/DespesasController');
const knex = require('../database/knex');
const AppError = require('../utils/AppError');

const {
    validarLimitOffset,
    validarValores,
    validarTipo,
} = require('../utils/validarParametrosDespesas');

const validarIdDeputado = require('../utils/validarIdDeputado');
const validarSiglaUf = require('../utils/validarSiglaUf');
const buildRankingQuery = require('../utils/buildRankingQuery');


// Realizando o mock do knex e das funções de validação
const mockKnexInstance = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    clone: jest.fn().mockReturnThis(),
    count: jest.fn().mockReturnThis(),
    first: jest.fn().mockReturnValue(Promise.resolve({ total: 2 })),
    then: jest.fn() // será definido nos testes
};

jest.mock("../database/knex", () => jest.fn(() => mockKnexInstance));
jest.mock('../utils/validarIdDeputado', () => jest.fn());
jest.mock('../utils/validarSiglaUf', () => jest.fn(async () => true));
jest.mock('../utils/validarParametrosDespesas', () => ({
    validarLimitOffset: jest.fn(),
    validarValores: jest.fn(),
    validarTipo: jest.fn(),
}));
jest.mock('../utils/buildRankingQuery', () => jest.fn());

describe('DespesasController', () => {
    describe("Método index", () => {
        let request, response;

        beforeEach(() => {
            request = {
                params: { deputado_id: '123' },
                query: {
                    limit: '10',
                    offset: '0',
                    valor_min: '100',
                    valor_max: '1000',
                    tipo: 'Hospedagem',
                    uf: 'PE'
                }
            };
            response = { json: jest.fn() };

            // Limpa mocks
            Object.values(mockKnexInstance).forEach(fn => {
                if (typeof fn.mockClear === 'function') fn.mockClear();
            });
            validarIdDeputado.mockReset();
            validarSiglaUf.mockReset();
            validarLimitOffset.mockReset();
            validarValores.mockReset();
            validarTipo.mockReset();

            // Simula retorno de despesas
            mockKnexInstance.then = jest.fn((cb) => cb([
                {
                    id: 1,
                    descricao: 'Hospedagem em Brasília',
                    valor_documento: 500,
                    data_emissao: '2024-05-15',
                    sigla_uf: 'PE'
                }
            ]));
            validarSiglaUf.mockResolvedValue(true);

            // Mock para validarLimitOffset: sempre retorna { limit, offset }
            validarLimitOffset.mockImplementation((limit, offset) => ({
                limit: limit ? Number(limit) : 10,
                offset: offset ? Number(offset) : 0
            }));
        });

        it('deve retornar despesas filtradas com sucesso', async () => {
            const controller = new DespesasController();
            await controller.index(request, response);

            expect(validarIdDeputado).toHaveBeenCalledWith('123');
            expect(validarLimitOffset).toHaveBeenCalledWith('10', '0');
            expect(validarValores).toHaveBeenCalledWith('100', '1000');
            expect(validarTipo).toHaveBeenCalledWith('Hospedagem');
            expect(validarSiglaUf).toHaveBeenCalledWith('PE');
            expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
                dados: expect.any(Array),
                total: 2,
                limit: 10,
                offset: 0
            }));
        });

        it('deve lançar erro se deputado_id for inválido', async () => {
            validarIdDeputado.mockImplementation(() => {
                throw new AppError('ID inválido');
            });
            const controller = new DespesasController();
            await expect(controller.index(request, response)).rejects.toThrow('ID inválido');
        });

        it('deve ignorar filtro de UF se inválida', async () => {
            validarSiglaUf.mockResolvedValue(false);
            const controller = new DespesasController();
            await controller.index(request, response);
            expect(validarSiglaUf).toHaveBeenCalledWith('PE');
            expect(response.json).toHaveBeenCalled();
        });

        it('deve aplicar paginação corretamente', async () => {
            const controller = new DespesasController();
            await controller.index(request, response);
            expect(mockKnexInstance.limit).toHaveBeenCalledWith(10);
            expect(mockKnexInstance.offset).toHaveBeenCalledWith(0);
        });

        it('deve lançar erro se validarLimitOffset lançar', async () => {
            validarLimitOffset.mockImplementation(() => { throw new AppError('erro', 400); });
            const controller = new DespesasController();
            await expect(controller.index(request, response)).rejects.toThrow(AppError);
            expect(validarLimitOffset).toHaveBeenCalled();
        });

        it('deve lançar erro se validarValores lançar', async () => {
            validarValores.mockImplementation(() => { throw new AppError('erro', 400); });
            const controller = new DespesasController();
            await expect(controller.index(request, response)).rejects.toThrow(AppError);
            expect(validarValores).toHaveBeenCalled();
        });

        it('deve lançar erro se validarTipo lançar', async () => {
            validarTipo.mockImplementation(() => { throw new AppError('erro', 400); });
            const controller = new DespesasController();
            await expect(controller.index(request, response)).rejects.toThrow(AppError);
            expect(validarTipo).toHaveBeenCalled();
        });

        it('deve passar todos os filtros para o query', async () => {
            request.query = { limit: '5', offset: '1', valor_min: '100', valor_max: '200', tipo: 'alimentação', uf: 'PE' };
            validarLimitOffset.mockImplementation((limit, offset) => ({
                limit: limit ? Number(limit) : 10,
                offset: offset ? Number(offset) : 0
            }));
            const controller = new DespesasController();
            await controller.index(request, response);
            expect(validarLimitOffset).toHaveBeenCalledWith('5', '1');
            expect(validarValores).toHaveBeenCalledWith('100', '200');
            expect(validarTipo).toHaveBeenCalledWith('alimentação');
        });

        it('deve funcionar com filtros mínimos (apenas obrigatórios)', async () => {
            request.query = { limit: '10', offset: '0' };
            validarLimitOffset.mockImplementation((limit, offset) => ({
                limit: limit ? Number(limit) : 10,
                offset: offset ? Number(offset) : 0
            }));
            const controller = new DespesasController();
            await controller.index(request, response);
            expect(validarLimitOffset).toHaveBeenCalledWith('10', '0');
            expect(validarValores).toHaveBeenCalledWith(undefined, undefined);
            expect(validarTipo).toHaveBeenCalledWith(undefined);
        });
    });

    describe("Método ranking", () => {
        let req, res;

        beforeEach(() => {
            req = {
                query: {
                    limit: '5',
                    offset: '10',
                    uf: 'SP',
                    partido: 'PT',
                    mes: '3',
                    ano: '2023',
                    ordem: 'desc',
                }
            };

            res = {
                json: jest.fn()
            };

            validarLimitOffset.mockReturnValue({ limit: 5, offset: 10 });
        });

        it('deve retornar o ranking corretamente com total válido', async () => {
            const mockRanking = [
                { id: 1, nome: 'Deputado A', total_gasto: 1000 },
                { id: 2, nome: 'Deputado B', total_gasto: 800 }
            ];

            const mockDataQuery = Promise.resolve(mockRanking);
            const mockTotalQuery = {
                first: jest.fn().mockResolvedValue({ total: 2 })
            };

            buildRankingQuery.mockResolvedValue({
                dataQuery: mockDataQuery,
                totalQuery: mockTotalQuery
            });

            const controller = new DespesasController();
            await controller.ranking(req, res);

            expect(validarLimitOffset).toHaveBeenCalledWith('5', '10');
            expect(buildRankingQuery).toHaveBeenCalledWith(req.query, 5, 10);
            expect(mockTotalQuery.first).toHaveBeenCalled();

            expect(res.json).toHaveBeenCalledWith({
                dados: mockRanking,
                total: 2,
                limit: 5,
                offset: 10
            });
        });

        it('deve retornar total como 0 se não vier no banco', async () => {
            const mockDataQuery = Promise.resolve([]);
            const mockTotalQuery = {
                first: jest.fn().mockResolvedValue({})
            };

            buildRankingQuery.mockResolvedValue({
                dataQuery: mockDataQuery,
                totalQuery: mockTotalQuery
            });

            const controller = new DespesasController();
            await controller.ranking(req, res);

            expect(res.json).toHaveBeenCalledWith({
                dados: [],
                total: 0,
                limit: 5,
                offset: 10
            });
        });

        it('deve retornar total como 0 se vier total inválido', async () => {
            const mockDataQuery = Promise.resolve([]);
            const mockTotalQuery = {
                first: jest.fn().mockResolvedValue({ total: 'not-a-number' })
            };

            buildRankingQuery.mockResolvedValue({
                dataQuery: mockDataQuery,
                totalQuery: mockTotalQuery
            });

            const controller = new DespesasController();
            await controller.ranking(req, res);

            expect(res.json).toHaveBeenCalledWith({
                dados: [],
                total: 0,
                limit: 5,
                offset: 10
            });
        });

        it('deve lidar com erro na execução da query', async () => {
            const error = new Error('Erro no banco');
            buildRankingQuery.mockRejectedValue(error);

            const next = jest.fn(); // caso você esteja usando middleware de erro

            const controller = new DespesasController();
            await expect(controller.ranking(req, res)).rejects.toThrow('Erro no banco');
        });
    });
});
