/** 
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = knex => knex.schema.createTable("users", table => {
    table.increments("id"); 
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").nullable(); // Senha pode ser nula para usuários que se autenticam via Google
    table.boolean("is_verified").defaultTo(false);
    table.string("verification_code").nullable();
    table.timestamp("code_expiration").nullable();
    table.string("gooogle_id").nullable();
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = knex => knex.schema.dropTable("users"); 