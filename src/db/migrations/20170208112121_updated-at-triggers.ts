import Knex from 'knex';

import * as helpers from '../migration-helpers';

export const up = function (knex: Knex, Promise: any) {
  return Promise.all([
    helpers.updatedAtFunction(knex).up,
    helpers.updatedAtTrigger(knex, 'users').up,
    helpers.updatedAtTrigger(knex, 'refresh_tokens').up,
    helpers.updatedAtTrigger(knex, 'roles').up,
    helpers.updatedAtTrigger(knex, 'causes').up,
    helpers.updatedAtTrigger(knex, 'tasks').up,
    helpers.updatedAtTrigger(knex, 'tasks_users').up,
    helpers.updatedAtTrigger(knex, 'causes_roles_users').up,
  ])
};

export const down = function (knex: Knex, Promise: any) {
  return Promise.all([
    helpers.updatedAtTrigger(knex, 'users').down,
    helpers.updatedAtTrigger(knex, 'refresh_tokens').down,
    helpers.updatedAtTrigger(knex, 'roles').down,
    helpers.updatedAtTrigger(knex, 'causes').down,
    helpers.updatedAtTrigger(knex, 'tasks').down,
    helpers.updatedAtTrigger(knex, 'tasks_users').down,
    helpers.updatedAtTrigger(knex, 'causes_roles_users').down,
    helpers.updatedAtFunction(knex).down,
  ]);
};
