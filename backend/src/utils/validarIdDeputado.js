const AppError = require('./AppError');
const knex = require('../database/knex');

async function validarIdDeputado(deputado_id) {

    deputado_id = Number(deputado_id);

    if (!Number.isInteger(deputado_id) || deputado_id <= 0) {
        throw new AppError("Parâmetro 'deputado_id' deve ser um número inteiro positivo", 400);
    }

    const deputado = await knex('deputados').where('id', deputado_id).first();

    if (!deputado) {
        throw new AppError(`Deputado com ID ${deputado_id} não encontrado`, 404);
    }

    return true;
}

module.exports = validarIdDeputado;
