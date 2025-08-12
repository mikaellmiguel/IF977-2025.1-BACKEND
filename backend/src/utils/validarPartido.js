const knex = require('../database/knex');
const AppError = require('../utils/AppError');

async function validarPartido(partido) {
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\\s]{2,30}$/.test(partido)) {
        throw new AppError("Parâmetro 'partido' inválido", 400);
    }

    const partidosDb = await knex("deputados").distinct("partido");
    const partidos_validos = partidosDb.map(p => p.partido.toUpperCase());

    if (!partidos_validos.includes(partido.toUpperCase())) {
        throw new AppError("Partido não encontrado", 400);
    }

    return true;
}

module.exports = validarPartido;