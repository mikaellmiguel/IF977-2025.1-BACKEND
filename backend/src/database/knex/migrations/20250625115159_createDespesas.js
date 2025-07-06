/** 
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => knex.schema.createTable("despesas", table => {
    table.increments("id").primary(); 
    table.integer("id_deputado").notNullable().references("id").inTable("deputados").onDelete("CASCADE");
    table.string("numero_carteira").notNullable();
    table.string("sigla_uf");
    table.string("sigla_partido");
    table.integer("descricao").notNullable();
    table.string("fornecedor").notNullable();
    table.string("cnpj").nullable();
    table.string("numero_documento").notNullable();
    table.timestamp("data_emissao").notNullable();
    table.decimal("valor_documento", 10, 2).notNullable();
    table.integer("mes").notNullable();
    table.integer("ano").notNullable();
    table.string("url_documento").nullable();
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => knex.schema.dropTable("depesas"); 