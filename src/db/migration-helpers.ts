import Knex from 'knex';

type MigrationObject = {
  up: Knex.Raw,
  down: Knex.Raw,
}

// Functions
export const psqlFunction = (knex: Knex, name: string, functionBody: string): MigrationObject => {
  const up = knex.raw(`CREATE FUNCTION ${name}() RETURNS ${functionBody};`);
  const down = knex.raw(`DROP FUNCTION ${name}();`);

  return { up, down };
}

const updatedAtFunctionName = 'update_updated_at_column';
const updatedAtFunctionBody = `
  trigger
      LANGUAGE plpgsql
      AS $$
    BEGIN
      NEW."updatedAt" = NOW();
      RETURN NEW;
    END;
  $$
`
export const updatedAtFunction = (knex: Knex) => psqlFunction(knex, updatedAtFunctionName, updatedAtFunctionBody);

// Triggers
const createTrigger = (table: string, triggerName: string, functionName: string) => `
  CREATE TRIGGER
    ${table}_${triggerName}
  BEFORE UPDATE ON
    ${table}
  FOR EACH ROW EXECUTE PROCEDURE
    ${functionName}();
`;

const dropTrigger = (table: string, triggerName: string) => `
  DROP TRIGGER ${table}_${triggerName} ON ${table};
`;

export const trigger = (knex: Knex, table: string, triggerName: string, functionName: string): MigrationObject => {
  const up = knex.raw(createTrigger(table, triggerName, functionName));
  const down = knex.raw(dropTrigger(table, triggerName));

  return { up, down };
}

export const updatedAtTrigger = (knex: Knex, table: string) => trigger(knex, table, 'updated_at_trigger', updatedAtFunctionName);



