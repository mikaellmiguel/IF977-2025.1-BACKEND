const AppError = require('../utils/AppError');
const {getDetailsDeputadoById} = require('../services/camara.service');

class DeputadosController {

    async show(request, response) {
        const { id } = request.params;
        const deputado = await getDetailsDeputadoById(id);
        return response.json(deputado);
    }

    
}

module.exports = DeputadosController;