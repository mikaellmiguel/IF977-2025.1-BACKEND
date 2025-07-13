const DeputadosController = require('./DeputadosController');
const { getDetailsDeputadoById } = require('../services/camara.service');
const AppError = require('../utils/AppError');

jest.mock('../services/camara.service');


const mockKnexInstance = {
    count: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    select: jest.fn(),
    first: jest.fn()
};

jest.mock("../database/knex", () => jest.fn((tableName) => mockKnexInstance)) ;

describe('DeputadosController', () => {
    let request, response;

    describe('Metodo show', () => {

        beforeEach(() => {
            request = { params: { id: '204555' } };
            response = { json: jest.fn() };
        });

        
        it('deve retornar os dados do deputado quando encontrado', async () => {
            const mockDeputado = { id: 204555, nome: 'Marcos Pereira' };
            getDetailsDeputadoById.mockResolvedValue(mockDeputado);
            const controller = new DeputadosController();
            await controller.show(request, response);
            expect(getDetailsDeputadoById).toHaveBeenCalledWith('204555');
            expect(response.json).toHaveBeenCalledWith(mockDeputado);
        });

        it('deve propagar erro se getDetailsDeputadoById lançar erro', async () => {
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

    describe('Metodo index', () => {
        
        let controller;
        let knexMockFn;
        let response;

        beforeEach(() => {
            controller = new DeputadosController();
            knexMockFn = require('../database/knex');
            response = { json: jest.fn() };
            jest.clearAllMocks();
        });

        it('deve retornar lista de deputados com total, limit e offset', async () => {

            mockKnexInstance.first.mockResolvedValue({ total: 2 });

            mockKnexInstance.orderBy("nome").limit(2).offset(0).select.mockResolvedValue([
                { id: 1, nome: 'Deputado 1', partido: 'ABC', sigla_uf: 'PE', url_foto: '', email: '', data_nascimento: '1980-01-01' },
                { id: 2, nome: 'Deputado 2', partido: 'DEF', sigla_uf: 'SP', url_foto: '', email: '', data_nascimento: '1985-01-01' }
            ]);

            const request = { query: { limit: '2', offset: '0' } };

            await controller.index(request, response);
            
            expect(knexMockFn("deputados").count).toHaveBeenCalledWith('* as total');
            expect(await knexMockFn("deputados").count("* as total").first()).toEqual({total: 2});
            expect(knexMockFn("deputados").orderBy).toHaveBeenCalledWith("nome");
            expect(knexMockFn("deputados").limit).toHaveBeenCalledWith(2);
            expect(knexMockFn("deputados").offset).toHaveBeenCalledWith(0);
            expect(knexMockFn("deputados").select).toHaveBeenCalledWith("id", "nome", "partido", "sigla_uf", "url_foto", "email", "data_nascimento");

            expect(response.json).toHaveBeenCalledWith({
                dados: [
                    { id: 1, nome: 'Deputado 1', partido: 'ABC', sigla_uf: 'PE', url_foto: '', email: '', data_nascimento: '1980-01-01' },
                    { id: 2, nome: 'Deputado 2', partido: 'DEF', sigla_uf: 'SP', url_foto: '', email: '', data_nascimento: '1985-01-01' }
                ],
                total: 2,
                limit: 2,
                offset: 0
            });
        });

        it('deve lançar erro se limit ou offset forem uma string não numérica', async () => {
            const request = { query: { limit: 'abc', offset: '0' } };
            
            try {
                await controller.index(request, response);
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                expect(error.message).toBe("Parâmetros 'limit' e 'offset' devem ser números inteiros positivos");
                expect(error.statusCode).toBe(400);
            }
        });
    });
});