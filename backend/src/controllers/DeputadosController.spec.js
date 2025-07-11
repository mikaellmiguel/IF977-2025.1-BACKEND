const DeputadosController = require('./DeputadosController');
const { getDetailsDeputadoById } = require('../services/camara.service');
const AppError = require('../utils/AppError');

jest.mock('../services/camara.service');

describe('DeputadosController', () => {
    let request, response;

    beforeEach(() => {
        request = { params: { id: '204555' } };
        response = { json: jest.fn() };
    });

    describe('show', () => {

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
});
