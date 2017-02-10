import Knex from 'knex';

export const up = function (knex: Knex) {
  return knex.schema.table('causes', table => {
    table.renameColumn('image', 'heroImage');
    table.renameColumn('logo', 'logoImage');
  })
};

export const down = function (knex: Knex) {
  return knex.schema.table('causes', table => {
    table.renameColumn('heroImage', 'image');
    table.renameColumn('logoImage', 'logo');
  })
};
