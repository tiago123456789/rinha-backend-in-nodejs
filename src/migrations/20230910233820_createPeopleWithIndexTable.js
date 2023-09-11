/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists("peoples_with_index", table => {
        table.uuid('id').index();
        table.string('apelido', 32).notNullable().index();
        table.string('nome', 100).notNullable();
        table.date('nascimento').notNullable();
        table.jsonb('stack').nullable();
        table.text("search").index();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("peoples_with_index")
};
