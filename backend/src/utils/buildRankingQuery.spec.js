const buildRankingQuery = require('../utils/buildRankingQuery');
const knex = require('../database/knex');

jest.mock('../database/knex', () => {
  const mockQuery = {
    join: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    raw: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    clone: jest.fn().mockReturnThis(),
    clearSelect: jest.fn().mockReturnThis(),
    clearGroup: jest.fn().mockReturnThis(),
    countDistinct: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
  };
  const knexMock = jest.fn(() => mockQuery);
  knexMock.raw = jest.fn().mockReturnThis();
  return knexMock;
});

jest.mock('../utils/validarSiglaUf', () => jest.fn());
jest.mock('../utils/validarPartido', () => jest.fn());
jest.mock('../utils/validarParametrosDespesas', () => ({
  validarMes: jest.fn(),
  validarAno: jest.fn()
}));

const validarSiglaUf = require('../utils/validarSiglaUf');
const validarPartido = require('../utils/validarPartido');
const { validarMes, validarAno } = require('../utils/validarParametrosDespesas');

describe('buildRankingQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve construir query sem filtros', async () => {
    const query = {};
    const result = await buildRankingQuery(query, 10, 0);
    
    expect(knex).toHaveBeenCalledWith('deputados');
    expect(result.dataQuery.orderBy).toHaveBeenCalledWith('total_gasto', 'desc');
    expect(result.dataQuery.limit).toHaveBeenCalledWith(10);
    expect(result.dataQuery.offset).toHaveBeenCalledWith(0);
  });

  it('deve aplicar filtro por UF, partido, mês e ano', async () => {
    validarSiglaUf.mockResolvedValue(true);
    validarPartido.mockResolvedValue(true);
    validarMes.mockReturnValue(true);
    validarAno.mockReturnValue(true);

    const query = {
      uf: 'SP',
      partido: 'PT',
      mes: 3,
      ano: 2023,
      ordem: 'asc',
    };

    const result = await buildRankingQuery(query, 5, 10);

    expect(validarSiglaUf).toHaveBeenCalledWith('SP');
    expect(validarPartido).toHaveBeenCalledWith('PT');
    expect(validarMes).toHaveBeenCalledWith(3);
    expect(validarAno).toHaveBeenCalledWith(2023);

    expect(result.dataQuery.orderBy).toHaveBeenCalledWith('total_gasto', 'asc');
    expect(result.dataQuery.limit).toHaveBeenCalledWith(5);
    expect(result.dataQuery.offset).toHaveBeenCalledWith(10);
  });

  it('deve ignorar filtro se UF inválida', async () => {
    validarSiglaUf.mockResolvedValue(false);

    const query = {
      uf: 'XX',
    };

    const result = await buildRankingQuery(query, 5, 0);

    expect(validarSiglaUf).toHaveBeenCalledWith('XX');
    expect(result.dataQuery.where).not.toHaveBeenCalledWith('deputados.sigla_uf', 'XX');
  });

  it('deve ordenar descendente por padrão', async () => {
    const query = {};
    const result = await buildRankingQuery(query, 10, 0);
    expect(result.dataQuery.orderBy).toHaveBeenCalledWith('total_gasto', 'desc');
  });

  it('deve ordenar ascendente se passado', async () => {
    const query = { ordem: 'asc' };
    const result = await buildRankingQuery(query, 10, 0);
    expect(result.dataQuery.orderBy).toHaveBeenCalledWith('total_gasto', 'asc');
  });
});
