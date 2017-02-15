import Knex from 'knex';

export const up = function (knex: Knex, Promise: any) {
  return Promise.all([
    knex.schema.table('causes_roles_users', table => {
      table.dropUnique(['causeId', 'roleId', 'userId']);
      table.dropColumn('roleId');
    }),
    knex.schema.table('roles', table => {
      table.unique(['name']);
    }),
    knex.schema.table('causes_roles_users', table => {
      table.string('roleName').references('name').inTable('roles').onUpdate('CASCADE').onDelete('CASCADE').notNullable();
      table.unique(['causeId', 'roleName', 'userId']);
    }),
  ])
};

export const down = function (knex: Knex) {
  return Promise.all([
    knex.schema.table('causes_roles_users', table => {
      table.dropUnique(['causeId', 'roleName', 'userId']);
      table.dropColumn('roleName');
      table.uuid('roleId').references('id').inTable('roles').onUpdate('CASCADE').onDelete('CASCADE').notNullable();
      table.unique(['causeId', 'roleId', 'userId']);
    }),
  ])
};
