import Knex from 'knex';

export const seed = function(knex: Knex, Promise: any) {
  return Promise.all([
    knex('roles').insert({ name: 'admin' }),
    knex('roles').insert({ name: 'owner' }),
    knex('roles').insert({ name: 'organizer' }),
    knex('roles').insert({ name: 'volunteer' }),
  ])
};
