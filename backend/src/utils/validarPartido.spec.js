const validarPartido = require('./validarPartido');
const AppError = require('../utils/AppError');

jest.mock('../database/knex', () => {
    return jest.fn( () => ({
        distinct: jest.fn().mockResolvedValue([{ partido: 'PT' }, { partido: 'PSDB' }])
    }))
});

const knex = require('../database/knex');

describe('validarPartido', () => {
    it('deve aceitar partido com acento', async () => {
        knex.mockImplementation(() => ({
            distinct: jest.fn().mockResolvedValue([{ partido: 'UNIÃO' }, { partido: 'SOLIDARIEDADE' }])
        }));
        await expect(validarPartido('UNIÃO')).resolves.toBe(true);
        await expect(validarPartido('união')).resolves.toBe(true);
    });


    it('deve aceitar partido com letras minúsculas e maiúsculas misturadas', async () => {
        knex.mockImplementation(() => ({
            distinct: jest.fn().mockResolvedValue([{ partido: 'PSDB' }])
        }));
        await expect(validarPartido('psdb')).resolves.toBe(true);
        await expect(validarPartido('PsDb')).resolves.toBe(true);
    });

    it('deve lançar erro para partido com caracteres especiais', async () => {
        await expect(validarPartido('P@T')).rejects.toThrow(AppError);
        await expect(validarPartido('P#T')).rejects.toThrow(AppError);
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar true para partido válido presente no banco', async () => {
        knex.mockImplementation(() => ({
            distinct: jest.fn().mockResolvedValue([{ partido: 'PT' }, { partido: 'PSDB' }])
        }));
        const resultado = await validarPartido('PT');
        expect(resultado).toBe(true);
    });

    it('deve lançar erro para partido com formato inválido', async () => {
        await expect(validarPartido('P1')).rejects.toThrow(AppError);
        await expect(validarPartido('')).rejects.toThrow(AppError);
        await expect(validarPartido('PARTIDO_MUITO_GRANDE')).rejects.toThrow(AppError);
    });

    it('deve lançar erro para partido não cadastrado no banco', async () => {
        knex.mockImplementation(() => ({
            distinct: jest.fn().mockResolvedValue([{ partido: 'PT' }, { partido: 'PSDB' }])
        }));
        await expect(validarPartido('MDB')).rejects.toThrow(AppError);
    });

    it('deve chamar o banco apenas se o formato for válido', async () => {
        const distinctMock = jest.fn().mockResolvedValue([{ partido: 'PT' }]);
        knex.mockImplementation(() => ({ distinct: distinctMock }));
        await expect(validarPartido('P1')).rejects.toThrow(AppError);
        expect(distinctMock).not.toHaveBeenCalled();
    });
});
