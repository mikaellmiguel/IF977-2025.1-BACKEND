const validarIdDeputado = require('../utils/validarIdDeputado');
const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const validarSiglaUf = require('../utils/validarSiglaUf');
const { validarLimitOffset, validarValores, validarTipo} = require('../utils/validarParametrosDespesas');

class DespesasController {

    async index(request, response) {
        const { deputado_id } = request.params;

        const { limit, offset, valor_min, valor_max, tipo, uf } = request.query;

        validarIdDeputado(deputado_id);
        validarLimitOffset(limit, offset);
        validarValores(valor_min, valor_max);
        validarTipo(tipo);

        let query = knex("despesas").where({ id_deputado: deputado_id }).orderBy("data_emissao", "desc");

        if (uf && await validarSiglaUf(uf)) query = query.where("sigla_uf", uf);
        if (valor_min) query = query.where("valor_documento", ">=", valor_min);
        if (valor_max) query = query.where("valor_documento", "<=", valor_max);
        if (tipo) query = query.where("descricao", "like", `%${tipo}%`);

        const despesas = await query.limit(limit).offset(offset);
        const {total} = await query.clone().count('* as total').first();
        
        response.json({
            dados:despesas,
            total: total,
            limit: Number(limit),
            offset: Number(offset) ? Number(offset) : 0 
        });
    }
}

module.exports = DespesasController;