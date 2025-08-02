const processarEntrada = require('./processarEntrada');

jest.mock('./mapearDespesas', () => jest.fn(() => [{ id_deputado: 1 }]));
jest.mock('./inserirEmLotes', () => jest.fn(() => Promise.resolve()));
const mapearDespesas = require('./mapearDespesas');
const inserirEmLotes = require('./inserirEmLotes');

describe('processarEntrada', () => {
    let entry, deputadosIds, BATCH_SIZE;
    let logSpy;
    beforeEach(() => {
        deputadosIds = new Set([1]);
        BATCH_SIZE = 200;
        jest.clearAllMocks();
        logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });
    afterEach(() => {
        logSpy.mockRestore();
    });

    function createEntryMock(path, json) {
        let listeners = {};
        return {
            path,
            autodrain: jest.fn(),
            on: (event, cb) => {
                listeners[event] = cb;
                return this;
            },
            emit: (event, arg) => {
                if (listeners[event]) listeners[event](arg);
            },
            triggerDataAndEnd: function() {
                listeners['data'] && listeners['data'](Buffer.from(json));
                listeners['end'] && listeners['end']();
            }
        };
    }

    it('deve processar entrada .json válida e chamar mapearDespesas/inserirEmLotes', async () => {
        const dados = { dados: [{ idDeputado: 1 }] };
        const entry = createEntryMock('arquivo.json', JSON.stringify(dados));
        // Aciona os eventos ANTES do await, pois agora processarEntrada retorna uma promise que só resolve após o end
        const promise = processarEntrada(entry, deputadosIds, BATCH_SIZE);
        entry.triggerDataAndEnd();
        await promise;
        expect(mapearDespesas).toHaveBeenCalledWith(dados.dados, deputadosIds);
        expect(inserirEmLotes).toHaveBeenCalledWith([{ id_deputado: 1 }], BATCH_SIZE);
    });

    it('deve ignorar arquivos não .json', async () => {
        const entry = createEntryMock('arquivo.txt', 'irrelevante');
        await processarEntrada(entry, deputadosIds, BATCH_SIZE);
        expect(entry.autodrain).toHaveBeenCalled();
        expect(mapearDespesas).not.toHaveBeenCalled();
        expect(inserirEmLotes).not.toHaveBeenCalled();
    });

    it('deve tratar erro de JSON inválido e logar erro', async () => {
        const entry = createEntryMock('arquivo.json', '{ json: invalido');
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const promise = processarEntrada(entry, deputadosIds, BATCH_SIZE);
        entry.triggerDataAndEnd();
        await promise;
        expect(spy).toHaveBeenCalledWith(expect.stringContaining('Erro ao processar arquivo.json'), expect.any(SyntaxError));
        spy.mockRestore();
    });
});
