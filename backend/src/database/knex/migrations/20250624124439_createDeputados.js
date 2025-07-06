/** 
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => knex.schema.createTable("deputados", table => {
    table.integer("id").notNullable().primary(); 
    table.string("nome").notNullable();
    table.string("partido").notNullable();
    table.string("url_partido").notNullable();
    table.string("sigla_uf").notNullable();
    table.integer("id_legislatura").notNullable();
    table.string("url_foto").nullable();
    table.string("email").notNullable();
    table.date("data_nascimento").notNullable();
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => knex.schema.dropTable("deputados"); 