import Knex from 'knex';

import * as helpers from '../migration-helpers';
export const up = function (knex: Knex, Promise: any) {
  return Promise.all([
    knex.schema.createTable('demo_requests', table => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.text('email');
      table.text('name');
      table.text('phoneNumber');
      table.timestamp('createdAt').defaultTo(knex.raw('now()')).notNullable();
      table.timestamp('updatedAt').defaultTo(knex.raw('now()')).notNullable();
    }),
  ])
  .then(() => helpers.updatedAtTrigger(knex, 'demo_requests').up);
};

export const down = function (knex: Knex, Promise: any) {
  return Promise.all([
    helpers.updatedAtTrigger(knex, 'demo_requests').down,
    knex.schema.dropTable('demo_requests'),
  ]);
};
