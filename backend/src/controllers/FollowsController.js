const AppError = require('../utils/AppError');
const knex = require('../database/knex');

class FollowsController {

    async create(request, response) {

        const {deputado_id} = request.params;
        const id = request.user;

        const followExists = await knex('follows').where({user_id: id, deputado_id}).first();
        const deputadoExists = await knex('deputados').where({id: deputado_id}).first();
        
        if(!deputadoExists) throw new AppError("Deputado não encontrado", 404);
        if(followExists) throw new AppError("Você já está seguindo este deputado");

        await knex('follows').insert({user_id: id, deputado_id});
        return response.status(201).json();

    }
}

module.exports = FollowsController;