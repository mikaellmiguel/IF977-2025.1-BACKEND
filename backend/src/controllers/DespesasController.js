const validarIdDeputado = require('../utils/validarIdDeputado');
const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const validarSiglaUf = require('../utils/validarSiglaUf');
const { validarLimitOffset, validarValores, validarTipo } = require('../utils/validarParametrosDespesas');
const buildRankingQuery = require('../utils/buildRankingQuery');
const validarPartido = require('../utils/validarPartido');

class DespesasController {

    async index(request, response) {
        const { deputado_id } = request.params;

        const { valor_min, valor_max, tipo, uf } = request.query;

        const { limit, offset } = validarLimitOffset(request.query.limit, request.query.offset);
        await validarIdDeputado(deputado_id);
        validarValores(valor_min, valor_max);
        validarTipo(tipo);

        let query = knex("despesas")
            .select("id", "sigla_uf", "descricao", "fornecedor", "valor_documento", "data_emissao")
            .where({ id_deputado: deputado_id }).orderBy("data_emissao", "desc");

        if (uf && await validarSiglaUf(uf)) query = query.where("sigla_uf", uf);
        if (valor_min) query = query.where("valor_documento", ">=", valor_min);
        if (valor_max) query = query.where("valor_documento", "<=", valor_max);
        if (tipo) query = query.where("descricao", "like", `%${tipo}%`);

        const totalResult = await query.clone().count('* as total').first();
        const despesas = await query.limit(limit).offset(offset);
        

        response.json({
            dados: despesas,
            total: totalResult ? Number(totalResult.total) : 0,
            limit: limit,
            offset: offset
        });
    }


    async ranking(request, response) {
        const { limit, offset } = validarLimitOffset(request.query.limit, request.query.offset);
        
        const {dataQuery, totalQuery} = await buildRankingQuery(request.query, limit, offset);
        
        const ranking = await dataQuery;
        const { total } = await totalQuery.first();

        response.json({
            dados: ranking,
            total: Number(total) ? Number(total) : 0,
            limit,
            offset
        });
    }

    async statistics(request, response) {

        const {deputado_id, mes, ano, partido, uf} = request.query;
        let query = knex("despesas");
        if (deputado_id && await validarIdDeputado(deputado_id)) query = query.where("id_deputado", deputado_id);
        if (partido && await validarPartido(partido)) query = query.where("sigla_partido", partido);
        if (uf && await validarSiglaUf(uf)) query = query.where("sigla_uf", uf);
        if (mes && Number(mes) >= 1 && Number(mes) <= 12) query = query.where("mes", mes);
        if (ano && Number(ano) >= 2023 && Number(ano) <= new Date().getFullYear()) query = query.where("ano", ano);

        const {total: totalDespesas} = await query.clone().count('* as total').first();
        const {total: totalValores} = await query.clone().sum('valor_documento as total').first();

        const ticketMedio = totalDespesas ? totalValores / totalDespesas : 0;

        const gastosPorMes = await query.clone().select('mes').sum('valor_documento as total').groupBy('mes');
        const gastosPorAno = await query.clone().select('ano').sum('valor_documento as total').groupBy('ano');
        const gastosPorTipo = await query.clone().select('descricao').sum('valor_documento as total').groupBy('descricao');
        const topFornecedores = await query.clone().select('fornecedor').sum('valor_documento as total').groupBy('fornecedor').orderBy('total', 'desc').limit(5);
        const despesaPorPartido = await query.clone().select('sigla_partido').sum('valor_documento as total').groupBy('sigla_partido');
        const despesaPorEstado = await query.clone().select('sigla_uf').sum('valor_documento as total').groupBy('sigla_uf');

        response.json({
            total_despesas: Number(totalDespesas) ? Number(totalDespesas) : 0,
            total_valores: Number(totalValores) ? Number(totalValores) : 0,
            ticket_medio: Number(ticketMedio) ? Number(ticketMedio) : 0,
            gastos_por_mes: gastosPorMes,
            gastos_por_ano: gastosPorAno,
            gastos_por_tipo: gastosPorTipo,
            top_fornecedores: topFornecedores,
            despesa_por_partido: despesaPorPartido,
            despesa_por_estado: despesaPorEstado
        });
    }

}
module.exports = DespesasController;