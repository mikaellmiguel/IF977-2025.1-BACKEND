const knex = require("../database/knex");
const AppError = require("../utils/AppError");

async function validarSiglaUf(siglaUf) {
    if (!/^[A-Z]{2}$/.test(siglaUf)) {
        throw new AppError("Parâmetro 'uf' inválido", 400);
    }

    const estadosDb = await knex("deputados").distinct("sigla_uf");
    const estados_validos = estadosDb.map(e => e.sigla_uf);

    if (!estados_validos.includes(siglaUf)) {
        throw new AppError("Estado não encontrado", 400);
    }

    return true;
}

module.exports = validarSiglaUf;