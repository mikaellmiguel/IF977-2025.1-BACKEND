/** 
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => knex.schema.createTable("follows", table => {
    table.increments("id"); 
    table.integer("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.integer("deputado_id").notNullable().references("id").inTable("deputados").onDelete("CASCADE");
    table.timestamp("created_at").default(knex.fn.now());
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => knex.schema.dropTable("follows");