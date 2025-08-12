const AppError = require('./AppError');
global.mockKnexImpl = undefined;
jest.mock('../database/knex', () => (...args) => global.mockKnexImpl(...args));
const validarIdDeputado = require('./validarIdDeputado');

describe('validarIdDeputado', () => {
    beforeEach(() => {
        global.mockKnexImpl = undefined;
    });

    it('deve passar se o id for válido e existir', async () => {
        global.mockKnexImpl = () => ({
            where: () => ({
                first: () => Promise.resolve({ id: 1 })
            })
        });
        await expect(validarIdDeputado(1)).resolves.toBe(true);
    });

    it('deve lançar erro se o id não for numérico', async () => {
        global.mockKnexImpl = () => { throw new Error('não deve chamar knex'); };
        try {
            await validarIdDeputado('abc');
        } catch (err) {
            expect(err).toBeInstanceOf(AppError);
            expect(err.message).toMatch(/deve ser um número inteiro positivo/);
            expect(err.statusCode).toBe(400);
        }
    });

    it('deve lançar erro se o id não existir', async () => {
        global.mockKnexImpl = () => ({
            where: () => ({
                first: () => Promise.resolve(undefined)
            })
        });
        try {
            await validarIdDeputado('999');
        } catch (err) {
            expect(err).toBeInstanceOf(AppError);
            expect(err.message).toMatch(/não encontrado/);
            expect(err.statusCode).toBe(404);
        }
    });

    it('deve lançar erro se o id for negativo ou zero', async () => {
        global.mockKnexImpl = () => { throw new Error('não deve chamar knex'); };
        for (const invalido of [-1, 0]) {
            try {
                await validarIdDeputado(invalido);
            } catch (err) {
                expect(err).toBeInstanceOf(AppError);
                expect(err.message).toMatch(/deve ser um número inteiro positivo/);
                expect(err.statusCode).toBe(400);
            }
        }
    });

    it('deve lançar erro se o id for vazio', async () => {
        global.mockKnexImpl = () => { throw new Error('não deve chamar knex'); };
        try {
            await validarIdDeputado('');
        } catch (err) {
            expect(err).toBeInstanceOf(AppError);
            expect(err.message).toMatch(/deve ser um número inteiro positivo/);
            expect(err.statusCode).toBe(400);
        }
    });

    it('deve lançar erro se o id for float ou string numérica inválida', async () => {
        global.mockKnexImpl = () => { throw new Error('não deve chamar knex'); };
        for (const invalido of ['1.5', '1a', 'a1', ' ']) {
            try {
                await validarIdDeputado(invalido);
            } catch (err) {
                expect(err).toBeInstanceOf(AppError);
                expect(err.message).toMatch(/deve ser um número inteiro positivo/);
                expect(err.statusCode).toBe(400);
            }
        }
    });
});
