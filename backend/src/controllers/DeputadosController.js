const AppError = require('../utils/AppError');
const {getDetailsDeputadoById} = require('../services/camara.service');
const knex = require('../database/knex'); // Assuming you have a knex instance set up for database access

class DeputadosController {

    async index(request, response) {

        const limit = request.query.limit || 20;
        const offset = request.query.offset || 0;

        //  Verifica se os parâmetros limit e offset são números inteiros positivos
        if(!/^\d+$/.test(limit) || !/^\d+$/.test(offset)) {
            throw new AppError("Parâmetros 'limit' e 'offset' devem ser números inteiros positivos", 400);
        }
    }
    
    async show(request, response) {
        const { id } = request.params;
        const deputado = await getDetailsDeputadoById(id);
        return response.json(deputado);
    }

    
}

module.exports = DeputadosController;