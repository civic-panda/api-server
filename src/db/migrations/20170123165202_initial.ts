import Knex from 'knex';

export const up = function(knex: Knex, Promise: any) {
	return Promise.all([
		knex.raw('CREATE EXTENSION "uuid-ossp"'),
		knex.schema.createTable('users', table => {
			table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
			table.text('email').notNullable().unique();
			table.text('password');
			table.text('name');
			table.text('phoneNumber');
			table.timestamp('createdAt').defaultTo(knex.raw('now()')).notNullable();
			table.timestamp('updatedAt').defaultTo(knex.raw('now()')).notNullable();
		}),
		knex.schema.createTable('refresh_tokens', table => {
	    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
	    table.text('token');
	    table.text('name');
			table.uuid('userId').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE').notNullable();
	    table.timestamp('createdAt').defaultTo(knex.raw('now()')).notNullable();
	    table.timestamp('updatedAt').defaultTo(knex.raw('now()')).notNullable();
	  }),
		knex.schema.createTable('roles', table => {
	    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
			table.text('name');
	    table.timestamp('createdAt').defaultTo(knex.raw('now()')).notNullable();
	    table.timestamp('updatedAt').defaultTo(knex.raw('now()')).notNullable();
	  }),
		knex.schema.createTable('causes', table => {
	    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
			table.text('name');
			table.text('callToAction');
			table.text('blurb');
			table.text('brandColor');
			table.text('logo');
			table.text('image');
			table.text('placeholderImage');
			table.text('summary');
			table.text('facts');
			table.text('reading');
			table.uuid('parent').references('id').inTable('causes').onUpdate('CASCADE').onDelete('CASCADE');
			table.boolean('published').defaultTo(false).notNullable();
	    table.timestamp('createdAt').defaultTo(knex.raw('now()')).notNullable();
	    table.timestamp('updatedAt').defaultTo(knex.raw('now()')).notNullable();
	  }),
		knex.schema.createTable('tasks', table => {
	    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
			table.text('name');
			table.uuid('causeId').references('id').inTable('causes').onUpdate('CASCADE').onDelete('CASCADE').notNullable();
			table.text('image');
			table.text('tags');
			table.text('summary');
			table.jsonb('location');
			table.text('duration');
			table.timestamp('startDate').defaultTo(knex.raw('now()'));
			table.timestamp('endDate').defaultTo(knex.raw('now()'));
			table.text('template');
			table.jsonb('templateProps');
			table.boolean('published').defaultTo(false).notNullable();
	    table.timestamp('createdAt').defaultTo(knex.raw('now()')).notNullable();
	    table.timestamp('updatedAt').defaultTo(knex.raw('now()')).notNullable();
	  }),
		knex.raw(`CREATE TYPE task_status AS ENUM ('started', 'finished')`),
		knex.schema.createTable('tasks_users', table => {
	    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
			table.uuid('taskId').references('id').inTable('tasks').onUpdate('CASCADE').onDelete('CASCADE').notNullable();
			table.uuid('userId').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE').notNullable();
			table.specificType('status', 'task_status').defaultTo('started').notNullable();
			table.unique(['taskId', 'userId']);
	    table.timestamp('createdAt').defaultTo(knex.raw('now()')).notNullable();
	    table.timestamp('updatedAt').defaultTo(knex.raw('now()')).notNullable();
	  }),
		knex.schema.createTable('causes_roles_users', table => {
	    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
			table.uuid('causeId').references('id').inTable('causes').onUpdate('CASCADE').onDelete('CASCADE').notNullable();
			table.uuid('roleId').references('id').inTable('roles').onUpdate('CASCADE').onDelete('CASCADE').notNullable();
			table.uuid('userId').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE').notNullable();
			table.unique(['causeId', 'roleId', 'userId']);
	    table.timestamp('createdAt').defaultTo(knex.raw('now()')).notNullable();
	    table.timestamp('updatedAt').defaultTo(knex.raw('now()')).notNullable();
	  }),
	])
};

export const down = function(knex: Knex, Promise: any) {
	return Promise.all([
		knex.schema.dropTable('causes_roles_users'),
		knex.schema.dropTable('tasks_users'),
		knex.raw(`DROP TYPE task_status`),
		knex.schema.dropTable('tasks'),
		knex.schema.dropTable('causes'),
		knex.schema.dropTable('roles'),
		knex.schema.dropTable('refresh_tokens'),
		knex.schema.dropTable('users'),
		knex.raw('DROP EXTENSION "uuid-ossp"'),
	]);
};
