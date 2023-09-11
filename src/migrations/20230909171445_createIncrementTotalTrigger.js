/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
    CREATE OR REPLACE FUNCTION increment_total_function() 
    RETURNS TRIGGER 
    LANGUAGE PLPGSQL
    AS $$
    BEGIN
        UPDATE total_peoples SET total = total + 1;
        RETURN NEW;
    END;
    $$;

    CREATE TRIGGER increment_total_trigger
    BEFORE INSERT
    ON peoples
    FOR EACH ROW
    EXECUTE PROCEDURE increment_total_function();

    INSERT INTO total_peoples(total) values (0)
  `)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    
  return knex.raw(`
    DROP TRIGGER IF EXISTS increment_total_trigger ON peoples;
    DROP FUNCTION IF EXISTS increment_total_function; 
  `)
};
