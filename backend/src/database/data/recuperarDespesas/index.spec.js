
// Mock do knex para evitar erro de configuração
jest.mock('../../knex', () => jest.fn(() => ({})));



describe('recuperarDespesas', () => {
    let deputados;
    let mockStream, mockOn;
    beforeEach(() => {
        deputados = [{ id: 1 }, { id: 2 }];
        mockOn = jest.fn();
        mockStream = { pipe: jest.fn(() => ({ on: mockOn })) };
        jest.clearAllMocks();
        jest.resetModules();
        Object.keys(require.cache).forEach(key => {
            if (key.includes('recuperarDespesas') || key.includes('processarEntrada') || key.includes('axios') || key.includes('unzipper')) {
                delete require.cache[key];
            }
        });
    });

    it('deve processar todas as entradas e aguardar todas as promessas', async () => {
        jest.resetModules();
        jest.doMock('axios', () => ({
            get: jest.fn(() => Promise.resolve({ data: mockStream }))
        }));
        jest.doMock('unzipper', () => ({
            Parse: jest.fn(() => ({ on: mockOn }))
        }));
        const entryMocks = [
            { dummy: 1 },
            { dummy: 2 }
        ];
        const processarEntrada = jest.fn(() => Promise.resolve());
        jest.doMock('./processarEntrada', () => processarEntrada);
        mockOn.mockImplementation(function(event, cb) {
            if (event === 'entry') {
                entryMocks.forEach(e => cb(e));
            }
            if (event === 'close') {
                setTimeout(cb, 0);
            }
            return this;
        });
        const recuperarDespesasAtual = require('./index');
        await expect(recuperarDespesasAtual(2024, deputados)).resolves.toBeUndefined();
        const axios = require('axios');
        const unzipper = require('unzipper');
        expect(axios.get).toHaveBeenCalled();
        expect(unzipper.Parse).toHaveBeenCalled();
        expect(processarEntrada).toHaveBeenCalledTimes(2);
    });

    it('deve rejeitar se processarEntrada lançar erro', async () => {
        jest.resetModules();
        jest.doMock('axios', () => ({
            get: jest.fn(() => Promise.resolve({ data: mockStream }))
        }));
        jest.doMock('unzipper', () => ({
            Parse: jest.fn(() => ({ on: mockOn }))
        }));
        const entryMocks = [{ dummy: 1 }];
        const processarEntrada = jest.fn(() => new Promise((_, reject) => setTimeout(() => reject(new Error('erro de processamento')), 0)));
        jest.doMock('./processarEntrada', () => processarEntrada);
        mockOn.mockImplementation(function(event, cb) {
            if (event === 'entry') entryMocks.forEach(e => cb(e));
            if (event === 'close') setTimeout(cb, 0);
            return this;
        });
        // Suprime console.error apenas neste teste
        const originalError = console.error;
        console.error = jest.fn();
        const recuperarDespesasAtual = require('./index');
        await expect(recuperarDespesasAtual(2024, deputados)).rejects.toThrow('erro de processamento');
        // Aguarda o próximo ciclo do event loop para garantir que todas as promises rejeitadas sejam processadas
        await new Promise(resolve => setImmediate(resolve));
        console.error = originalError;
    });

    it('deve rejeitar se axios.get lançar erro', async () => {
        jest.resetModules();
        jest.doMock('axios', () => ({
            get: jest.fn(() => Promise.reject(new Error('erro download')))
        }));
        const recuperarDespesasAtual = require('./index');
        await expect(recuperarDespesasAtual(2024, deputados)).rejects.toThrow('erro download');
    });
});
