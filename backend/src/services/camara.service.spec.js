const MockAdapter = require('axios-mock-adapter');
const { getDetailsDeputadoById, api } = require('./camara.service');
const AppError = require('../utils/AppError');

describe('getDetailsDeputadoById', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('deve retornar os dados normalizados do deputado', async () => {
    const mockResponse = {
      dados: {
        id: 204555,
        nomeCivil: 'Marcos Pereira',
        dataNascimento: '1972-04-04',
        escolaridade: 'Superior Completo',
        ultimoStatus: {
          id: 204555,
          nome: 'Marcos Pereira',
          siglaPartido: 'PL',
          siglaUf: 'SP',
          urlFoto: 'https://www.camara.leg.br/internet/deputado/bandep/204555.jpg',
          gabinete: {
            nome: '450',
            predio: 'Anexo IV',
            sala: '450',
            email: 'dep.marcospereira@camara.leg.br',
            telefone: '3215-5445',
          },
        },
        redeSocial: [
          'https://twitter.com/marcos_pereira',
          'https://facebook.com/marcos.pereira',
        ],
      },
    };

    mock.onGet('https://dadosabertos.camara.leg.br/api/v2/deputados/204555').reply(200, mockResponse);

    const result = await getDetailsDeputadoById(204555);

    expect(result).toEqual({
      id: 204555,
      nome_civel: 'Marcos Pereira',
      nome: 'Marcos Pereira',
      partido: 'PL',
      sigla_uf: 'SP',
      email: 'dep.marcospereira@camara.leg.br',
      telefone: '3215-5445',
      url_foto: 'https://www.camara.leg.br/internet/deputado/bandep/204555.jpg',
      gabinete: {
        nome: '450',
        predio: 'Anexo IV',
        sala: '450',
      },
      redes_social: [
        'https://twitter.com/marcos_pereira',
        'https://facebook.com/marcos.pereira',
      ],
      escolaridade: 'Superior Completo',
      data_nascimento: '1972-04-04',
    });
  });
});
