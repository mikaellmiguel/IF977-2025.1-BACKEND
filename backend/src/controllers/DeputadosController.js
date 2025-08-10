const AppError = require('../utils/AppError');
const {getDetailsDeputadoById} = require('../services/camara.service');
const knex = require('../database/knex'); // Assuming you have a knex instance set up for database access
const validarPartido = require('../utils/validarPartido');
const validarSiglaUf = require('../utils/validarSiglaUf');
const validarIdDeputado = require('../utils/validarIdDeputado');

class DeputadosController {
    
    async show(request, response) {
        const { id } = request.params;
        const userId = request.user;
        await validarIdDeputado(id);
        const deputado = await getDetailsDeputadoById(id);

        let isFollowing = false;
        const follow = await knex('follows').where({ user_id: userId, deputado_id: id }).first();

        isFollowing = !!follow;
        return response.json({
            ...deputado,
            isFollowing
        });
    }

    async search(request, response) {
        const { name, partido, uf } = request.query;

        const limit = request.query.limit || 20;
        const offset = request.query.offset || 0;

        if(!/^\d+$/.test(limit) || !/^\d+$/.test(offset)) {
            throw new AppError("Parâmetros 'limit' e 'offset' devem ser números inteiros positivos", 400);
        }

        let query = knex("deputados").orderBy("nome");
        if (name) query = query.where("nome", "like", `%${name}%`);
        if (partido && await validarPartido(partido)) query = query.where("partido", partido);
        if (uf && await validarSiglaUf(uf)) query = query.where("sigla_uf", uf);

        const { total } = await query.clone().count('* as total').first();
        const deputados = await query
            .limit(limit)
            .offset(offset)
            .select("id", "nome", "partido", "sigla_uf", "url_foto", "email", "data_nascimento");

        return response.json({
            dados: deputados,
            total: total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    }
}

module.exports = DeputadosController;