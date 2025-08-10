const AppError = require('../utils/AppError');
const knex = require('../database/knex');

class FollowsController {

    async create(request, response) {

        const {deputado_id} = request.params;
        const id = request.user;

        const followExists = await knex('follows').where({user_id: id, deputado_id}).first();
        const deputadoExists = await knex('deputados').where({id: deputado_id}).first();
        
        if(!deputadoExists) throw new AppError("Deputado não encontrado", 404);
        if(followExists) throw new AppError("Você já está seguindo este deputado");

        await knex('follows').insert({user_id: id, deputado_id});
        return response.status(201).json();

    }

    async index(request, response) {
        const id = request.user;
        const deputadosSeguidos = await knex('follows')
            .join('deputados', 'follows.deputado_id', '=', 'deputados.id')
            .where('follows.user_id', id)
            .select('deputados.*');


        const idsDeputados = deputadosSeguidos.map(deputado => deputado.id);

        const despesas = await knex('despesas')
            .whereIn('id_deputado', idsDeputados)
            .select('id_deputado', 'ano')
            .sum('valor_documento as total_gasto')
            .groupBy('id_deputado', 'ano');

        const resultado = deputadosSeguidos.map(deputado => {
            const despesasPorAno = despesas.filter(despesa => despesa.id_deputado === deputado.id)
                .reduce((acc, despesa) => {
                    acc[despesa.ano] = despesa.total_gasto;
                    return acc;
                }, {});

            const totalGasto = Number(Object.values(despesasPorAno).reduce((a, b) => a + b, 0).toFixed(2));

            return {
                deputado,
                despesasPorAno,
                totalGasto
            };
        })
        // const totalDespesas = await knex('despesas').whereIn('id_deputado', idsDeputados).sum('valor_documento as total_gasto').groupBy('id_deputado');

        return response.json(resultado);
    }
}

module.exports = FollowsController;