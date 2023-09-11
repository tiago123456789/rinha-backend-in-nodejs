/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists("peoples", table => {
        table.uuid('id');
        table.string('apelido', 32).notNullable();
        table.string('nome', 100).notNullable();
        table.date('nascimento').notNullable();
        table.jsonb('stack').nullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("peoples")
};
