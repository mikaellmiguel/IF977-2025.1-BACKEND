const validarSiglaUf = require('./validarSiglaUf');
const AppError = require('../utils/AppError');

jest.mock('../database/knex', () => {
    return jest.fn(() => ({
        distinct: jest.fn().mockResolvedValue([{ sigla_uf: 'PE' }, { sigla_uf: 'SP' }])
    }));
});
const knex = require('../database/knex');

describe('validarSiglaUf', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar true para sigla válida presente no banco', async () => {
        const resultado = await validarSiglaUf('PE');
        expect(resultado).toBe(true);
    });

    it('deve lançar erro para sigla com formato inválido', async () => {
        await expect(validarSiglaUf('P3')).rejects.toThrow(AppError);
        await expect(validarSiglaUf('')).rejects.toThrow(AppError);
        await expect(validarSiglaUf('PERNAMBUCO')).rejects.toThrow(AppError);
    });

    it('deve lançar erro para sigla não cadastrada no banco', async () => {
        knex.mockImplementation(() => ({
            distinct: jest.fn().mockResolvedValue([{ sigla_uf: 'PE' }, { sigla_uf: 'SP' }])
        }));
        await expect(validarSiglaUf('RU')).rejects.toThrow(AppError);
    });

    it('deve chamar o banco apenas se o formato for válido', async () => {
        const distinctMock = jest.fn().mockResolvedValue([{ sigla_uf: 'PE' }]);
        knex.mockImplementation(() => ({ distinct: distinctMock }));
        await expect(validarSiglaUf('P3')).rejects.toThrow(AppError);
        expect(distinctMock).not.toHaveBeenCalled();
    });
});
