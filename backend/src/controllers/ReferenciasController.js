const knex = require("../database/knex");
const validarIdDeputado = require('../utils/validarIdDeputado');

class ReferenciasController {

    async getReferenciasDespesas(request, response) {
        const {id} = request.query;
        let query = knex("despesas");

        if (id) {
            await validarIdDeputado(id);
            query = query.where("id_deputado", id);
        }

        const tipos = await query.clone().distinct("descricao").pluck("descricao");
        const estados = await query.clone().distinct("sigla_uf").pluck("sigla_uf");

        return response.json({
            tipos: tipos,
            estados: estados
        });
    }

}

module.exports =  ReferenciasController;