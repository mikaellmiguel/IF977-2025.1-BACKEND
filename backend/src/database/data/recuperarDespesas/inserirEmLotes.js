const knex = require("../../knex");

async function inserirEmLotes(despesas, batch_size = 200) {
    for (let i = 0; i < despesas.length; i += batch_size) {
        const batch = despesas.slice(i, i + batch_size);
        await knex('despesas').insert(batch).onConflict(['id_deputado', 'numero_documento', 'data_emissao', 'valor_documento', 'id_documento', 'trecho']).merge();
    }
}

module.exports = inserirEmLotes;