const knex = require('../database/knex');
const { validarMes, validarAno } = require('./validarParametrosDespesas');
const validarPartido = require('./validarPartido');
const validarSiglaUf = require('./validarSiglaUf');

async function buildRankingQuery(query, limit, offset) {
    const { uf, partido, mes, ano, ordem } = query;

    let rankingQuery = knex('deputados')
        .join('despesas', 'despesas.id_deputado', 'deputados.id')
        .select(
            'deputados.id as id',
            'deputados.nome as nome',
            'deputados.url_foto as url_foto',
            'deputados.partido as partido',
            'deputados.sigla_uf as uf',
            knex.raw('SUM(despesas.valor_documento) as total_gasto')
        )
        .groupBy('deputados.id');

    if (uf && await validarSiglaUf(uf)) rankingQuery = rankingQuery.where('deputados.sigla_uf', uf);
    if (partido && await validarPartido(partido)) rankingQuery = rankingQuery.where('deputados.partido', partido);
    if (mes && validarMes(mes)) rankingQuery = rankingQuery.where('despesas.mes', mes);
    if (ano && validarAno(ano)) rankingQuery = rankingQuery.where('despesas.ano', ano);

    const totalQuery  =  rankingQuery.clone().clearSelect().clearGroup().countDistinct('deputados.id as total');
    const dataQuery = rankingQuery.clone().orderBy('total_gasto', ordem === 'asc' ? 'asc' : 'desc').limit(limit).offset(offset);

    return { dataQuery, totalQuery };
}

module.exports = buildRankingQuery;
