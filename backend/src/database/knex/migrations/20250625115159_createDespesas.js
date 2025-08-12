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
    table.string("descricao").notNullable();
    table.string("fornecedor").notNullable();
    table.string("cnpj").nullable();
    table.string("numero_documento").notNullable();
    table.timestamp("data_emissao").nullable();
    table.decimal("valor_documento", 10, 2).notNullable();
    table.integer("mes").notNullable();
    table.integer("ano").notNullable();
    table.integer("id_documento").notNullable();
    table.string("url_documento").nullable();
    table.string("trecho").nullable();
    table.unique(["id_deputado", "numero_documento", "data_emissao", "valor_documento", "id_documento", "trecho"]);
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => knex.schema.dropTable("despesas"); 