
/**
 * AUTO-GENERATED FILE @ 2017-02-09 17:37:11 - DO NOT EDIT!
 *
 * This file was generated with schemats node package:
 * $ schemats generate -c postgres://username:password@localhost/actonthis -o src/db/schema.ts
 *
 * Re-run the command above.
 *
 */

export type task_status = 'finished' | 'started';

export namespace refresh_tokensFields {
    export type id = string;
    export type token = string | null;
    export type name = string | null;
    export type userId = string;
    export type createdAt = Date;
    export type updatedAt = Date;

}

export interface refresh_tokens {
    id: refresh_tokensFields.id;
    token: refresh_tokensFields.token;
    name: refresh_tokensFields.name;
    userId: refresh_tokensFields.userId;
    createdAt: refresh_tokensFields.createdAt;
    updatedAt: refresh_tokensFields.updatedAt;

}

export namespace tasks_usersFields {
    export type id = string;
    export type taskId = string;
    export type userId = string;
    export type status = task_status;
    export type createdAt = Date;
    export type updatedAt = Date;

}

export interface tasks_users {
    id: tasks_usersFields.id;
    taskId: tasks_usersFields.taskId;
    userId: tasks_usersFields.userId;
    status: tasks_usersFields.status;
    createdAt: tasks_usersFields.createdAt;
    updatedAt: tasks_usersFields.updatedAt;

}

export namespace usersFields {
    export type id = string;
    export type email = string;
    export type password = string | null;
    export type name = string | null;
    export type phoneNumber = string | null;
    export type createdAt = Date;
    export type updatedAt = Date;

}

export interface users {
    id: usersFields.id;
    email: usersFields.email;
    password: usersFields.password;
    name: usersFields.name;
    phoneNumber: usersFields.phoneNumber;
    createdAt: usersFields.createdAt;
    updatedAt: usersFields.updatedAt;

}

export namespace tasksFields {
    export type id = string;
    export type name = string | null;
    export type causeId = string;
    export type image = string | null;
    export type tags = string | null;
    export type summary = string | null;
    export type location = Object | null;
    export type duration = string | null;
    export type startDate = Date | null;
    export type endDate = Date | null;
    export type template = string | null;
    export type templateProps = Object | null;
    export type published = boolean;
    export type createdAt = Date;
    export type updatedAt = Date;

}

export interface tasks {
    id: tasksFields.id;
    name: tasksFields.name;
    causeId: tasksFields.causeId;
    image: tasksFields.image;
    tags: tasksFields.tags;
    summary: tasksFields.summary;
    location: tasksFields.location;
    duration: tasksFields.duration;
    startDate: tasksFields.startDate;
    endDate: tasksFields.endDate;
    template: tasksFields.template;
    templateProps: tasksFields.templateProps;
    published: tasksFields.published;
    createdAt: tasksFields.createdAt;
    updatedAt: tasksFields.updatedAt;

}

export namespace rolesFields {
    export type id = string;
    export type name = string | null;
    export type createdAt = Date;
    export type updatedAt = Date;

}

export interface roles {
    id: rolesFields.id;
    name: rolesFields.name;
    createdAt: rolesFields.createdAt;
    updatedAt: rolesFields.updatedAt;

}

export namespace migrations_lockFields {
    export type is_locked = number | null;

}

export interface migrations_lock {
    is_locked: migrations_lockFields.is_locked;

}

export namespace causes_roles_usersFields {
    export type id = string;
    export type causeId = string;
    export type roleId = string;
    export type userId = string;
    export type createdAt = Date;
    export type updatedAt = Date;

}

export interface causes_roles_users {
    id: causes_roles_usersFields.id;
    causeId: causes_roles_usersFields.causeId;
    roleId: causes_roles_usersFields.roleId;
    userId: causes_roles_usersFields.userId;
    createdAt: causes_roles_usersFields.createdAt;
    updatedAt: causes_roles_usersFields.updatedAt;

}

export namespace causesFields {
    export type id = string;
    export type name = string | null;
    export type callToAction = string | null;
    export type blurb = string | null;
    export type brandColor = string | null;
    export type logoImage = string | null;
    export type heroImage = string | null;
    export type placeholderImage = string | null;
    export type summary = string | null;
    export type facts = string | null;
    export type reading = string | null;
    export type parent = string | null;
    export type published = boolean;
    export type createdAt = Date;
    export type updatedAt = Date;

}

export interface causes {
    id: causesFields.id;
    name: causesFields.name;
    callToAction: causesFields.callToAction;
    blurb: causesFields.blurb;
    brandColor: causesFields.brandColor;
    logoImage: causesFields.logoImage;
    heroImage: causesFields.heroImage;
    placeholderImage: causesFields.placeholderImage;
    summary: causesFields.summary;
    facts: causesFields.facts;
    reading: causesFields.reading;
    parent: causesFields.parent;
    published: causesFields.published;
    createdAt: causesFields.createdAt;
    updatedAt: causesFields.updatedAt;

}

export namespace migrationsFields {
    export type id = number;
    export type name = string | null;
    export type batch = number | null;
    export type migration_time = Date | null;

}

export interface migrations {
    id: migrationsFields.id;
    name: migrationsFields.name;
    batch: migrationsFields.batch;
    migration_time: migrationsFields.migration_time;

}
