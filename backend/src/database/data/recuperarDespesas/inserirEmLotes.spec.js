const inserirEmLotes = require('./inserirEmLotes');

const mockKnexInstance = {
    insert: jest.fn().mockReturnThis(),
    onConflict: jest.fn().mockReturnThis(),
    merge: jest.fn().mockResolvedValue(undefined)
};

jest.mock('../../knex', () => jest.fn((tableName) => mockKnexInstance));

describe('inserirEmLotes (recuperarDespesas)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        knexMockFn = require('../../knex');
    });

    it('deve inserir despesas em lotes corretamente', async () => {
        const despesas = Array.from({ length: 450 }, (_, i) => ({ id_deputado: i, numero_documento: i }));
        await inserirEmLotes(despesas, 200);
        // Deve chamar knexMockFn 3 vezes (1 por lote)
        expect(knexMockFn).toHaveBeenCalledTimes(3);
        expect(mockKnexInstance.insert).toHaveBeenCalledTimes(3);
        expect(mockKnexInstance.onConflict).toHaveBeenCalledTimes(3);
        expect(mockKnexInstance.merge).toHaveBeenCalledTimes(3);
    });

    it('deve lidar com array vazio sem erros', async () => {
        await expect(inserirEmLotes([], 200)).resolves.toBeUndefined();
        expect(knexMockFn).not.toHaveBeenCalled();
        expect(mockKnexInstance.insert).not.toHaveBeenCalled();
        expect(mockKnexInstance.onConflict).not.toHaveBeenCalled();
        expect(mockKnexInstance.merge).not.toHaveBeenCalled();
    });
});
