/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.raw(`
        CREATE OR REPLACE FUNCTION populate_people_with_index_table() 
        RETURNS TRIGGER 
        LANGUAGE PLPGSQL
        AS $$
        BEGIN
            INSERT INTO peoples_with_index(id, nome, apelido, nascimento, stack, search)
            VALUES (NEW.id, NEW.nome, NEW.apelido, NEW.nascimento, NEW.stack, NEW.search);
            RETURN NEW;
        END;
        $$;

        CREATE TRIGGER populate_people_with_index_table_trigger
        AFTER INSERT
        ON peoples
        FOR EACH ROW
        EXECUTE PROCEDURE populate_people_with_index_table();

    `)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.raw(`
        DROP TRIGGER IF EXISTS populate_people_with_index_table_trigger ON peoples;
        DROP FUNCTION IF EXISTS populate_people_with_index_table; 
    `)
};
