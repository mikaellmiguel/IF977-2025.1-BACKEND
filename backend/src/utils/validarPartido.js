const knex = require('../database/knex');
const AppError = require('../utils/AppError');

async function validarPartido(partido) {
    if (!/^[A-Z]{2,5}$/.test(partido)) {
        throw new AppError("Parâmetro 'partido' inválido", 400);
    }

    const partidosDb = await knex("deputados").distinct("partido");
    const partidos_validos = partidosDb.map(p => p.partido);

    if (!partidos_validos.includes(partido)) {
        throw new AppError("Partido não encontrado", 400);
    }

    return true;
}

module.exports = validarPartido;