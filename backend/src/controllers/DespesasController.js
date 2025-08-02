const validarIdDeputado = require('../utils/validarIdDeputado');
const knex = require('../database/knex');
const AppError = require('../utils/AppError');

class DespesasController {

    async index(request, response) {
        const {deputado_id} = request.params;
        await validarIdDeputado(deputado_id);

        const limit = request.query.limit ? Number(request.query.limit) : 10;
        const offset = request.query.offset ? Number(request.query.offset) : 0;

        const {total} = await knex('despesas').where('id_deputado', deputado_id).count('* as total').first();

        const despesas = await knex('despesas').select('descricao', 'valor_documento', 'data_emissao', 'fornecedor', 'sigla_uf')
                                .where('id_deputado', deputado_id).orderBy('data_emissao', 'desc').limit(limit).offset(offset);

        response.json({
            dados: despesas,
            total: total,
            limit: limit,
            offset: offset
        });
    }

}

module.exports = DespesasController;