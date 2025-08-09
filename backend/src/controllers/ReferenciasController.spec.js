jest.mock('../utils/validarIdDeputado', () => jest.fn(async () => true));
const ReferenciasController = require('./ReferenciasController');
const mockKnexInstance = {
  clone: jest.fn().mockReturnThis(),
  distinct: jest.fn().mockReturnThis(),
  pluck: jest.fn(),
  where: jest.fn().mockReturnThis()
};

jest.mock("../database/knex", () => jest.fn((tableName) => mockKnexInstance));
const knex = require('../database/knex');

const mockResponse = () => {
  const res = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe('ReferenciasController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getReferenciasDespesas', () => {
        it('retorna todos os tipos e estados sem filtro', async () => {
            const tiposMock = ['Tipo A', 'Tipo B'];
            const estadosMock = ['SP', 'RJ'];
            const query = { clone: jest.fn().mockReturnThis(), distinct: jest.fn().mockReturnThis(), pluck: jest.fn() };
            query.distinct.mockImplementationOnce(() => query).mockImplementationOnce(() => query);
            query.pluck.mockImplementationOnce(() => Promise.resolve(tiposMock)).mockImplementationOnce(() => Promise.resolve(estadosMock));
            knex.mockReturnValue(query);

            const req = { query: {} };
            const res = mockResponse();
            await ReferenciasController.prototype.getReferenciasDespesas(req, res);
            expect(res.json).toHaveBeenCalledWith({ tipos: tiposMock, estados: estadosMock });
        });

        it('filtra por deputado quando id é passado', async () => {
            const tiposMock = ['Tipo C'];
            const estadosMock = ['MG'];
            const query = { clone: jest.fn().mockReturnThis(), distinct: jest.fn().mockReturnThis(), pluck: jest.fn(), where: jest.fn().mockReturnThis() };
            query.distinct.mockImplementationOnce(() => query).mockImplementationOnce(() => query);
            query.pluck.mockImplementationOnce(() => Promise.resolve(tiposMock)).mockImplementationOnce(() => Promise.resolve(estadosMock));
            knex.mockReturnValue(query);

            const req = { query: { id: '123' } };
            const res = mockResponse();
            await ReferenciasController.prototype.getReferenciasDespesas(req, res);
            expect(query.where).toHaveBeenCalledWith('id_deputado', '123');
            expect(res.json).toHaveBeenCalledWith({ tipos: tiposMock, estados: estadosMock });
        });

        it('retorna arrays vazios se não houver despesas', async () => {
            const query = { clone: jest.fn().mockReturnThis(), distinct: jest.fn().mockReturnThis(), pluck: jest.fn() };
            query.distinct.mockImplementationOnce(() => query).mockImplementationOnce(() => query);
            query.pluck.mockImplementationOnce(() => Promise.resolve([])).mockImplementationOnce(() => Promise.resolve([]));
            knex.mockReturnValue(query);

            const req = { query: {} };
            const res = mockResponse();
            await ReferenciasController.prototype.getReferenciasDespesas(req, res);
            expect(res.json).toHaveBeenCalledWith({ tipos: [], estados: [] });
        });
    });

    describe('getReferenciasDeputados', () => {
        it('retorna estados e partidos dos deputados', async () => {
            const estadosMock = ['PE', 'BA'];
            const partidosMock = ['PT', 'PSDB'];
            const query = { clone: jest.fn().mockReturnThis(), distinct: jest.fn().mockReturnThis(), pluck: jest.fn() };
            query.distinct.mockImplementationOnce(() => query).mockImplementationOnce(() => query);
            query.pluck.mockImplementationOnce(() => Promise.resolve(estadosMock)).mockImplementationOnce(() => Promise.resolve(partidosMock));
            knex.mockReturnValue(query);

            const req = {};
            const res = mockResponse();
            await ReferenciasController.prototype.getReferenciasDeputados(req, res);
            expect(res.json).toHaveBeenCalledWith({ estados: estadosMock, partidos: partidosMock });
        });

        it('retorna arrays vazios se não houver deputados', async () => {
            const query = { clone: jest.fn().mockReturnThis(), distinct: jest.fn().mockReturnThis(), pluck: jest.fn() };
            query.distinct.mockImplementationOnce(() => query).mockImplementationOnce(() => query);
            query.pluck.mockImplementationOnce(() => Promise.resolve([])).mockImplementationOnce(() => Promise.resolve([]));
            knex.mockReturnValue(query);

            const req = {};
            const res = mockResponse();
            await ReferenciasController.prototype.getReferenciasDeputados(req, res);
            expect(res.json).toHaveBeenCalledWith({ estados: [], partidos: [] });
        });
    });
});
