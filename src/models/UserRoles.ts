import db from '../db/schema';
import * as permissions from '../util/permissions';
import { Table, knexInstance } from '../db/knex';
import Task from './Task';

type ReturnedColumns = 'id' | 'userId' | 'causeId' | 'roleId';
const returnedColumns: ReturnedColumns[] = ['id', 'userId', 'causeId', 'roleId']
const UserRoles = new Table<db.causes_roles_users, ReturnedColumns>('causes_roles_users', returnedColumns);

const getAll = (userId: string) => {
  /*
    SELECT
      c.*,
      roles.name as role
    FROM
      causes c
    LEFT JOIN (
      SELECT
        *
      FROM
        causes_roles_users cru
      WHERE
        "userId" = 'c8df88b7-28a6-43ec-8b6e-af1e60b32ec7'
    ) r
    ON
      c.id = "causeId"
    LEFT JOIN
      roles
    ON
      r."roleId" = roles.id
  */

  return knexInstance
    .select('c.*', 'roles.name as role', 'roles.id as roleId')
    .from('causes as c')
    .joinRaw(`
      LEFT JOIN (
        SELECT
        *
        FROM
        causes_roles_users cru
        WHERE
        "userId" = '${userId}'
      ) r
      ON
      c.id = "causeId"
    `)
    .leftJoin('roles', 'r.roleId', 'roles.id')
}

const forTask = async (userId: string, taskId: string) => {
  const { causeId } = await Task.findOne({ id: taskId });
  if (!causeId) throw 'Task does not exist';
  return forCause(userId, causeId);
}

const forCause = async (userId: string, causeId: string): Promise<permissions.role> => {
  /*
    SELECT
      r.name as role
    FROM
      causes_roles_users cru
      INNER JOIN causes c ON c.id = cru."causeId"
      INNER JOIN roles r ON r.id = cru."roleId"
    WHERE
      "userId" = `${userId}` AND
      "causeId" = `${causeId}`
  */
  return knexInstance
    .select('r.name as role')
    .from('causes_roles_users as cru')
    .join('causes as c', 'c.id', 'causeId')
    .join('roles as r', 'r.id', 'roleId')
    .where('cru.userId', userId)
    .andWhere('cru.causeId', causeId)
    .then(roles => roles.length ? roles[0].role : undefined);
}

const promotable = async (userId: string, causes: { id: string, roleId: string }[]) => {
  return knexInstance
    .select('u.name as name', 'u.email as email', 'u.id as userId', 'r.name as role', 'cru.id as id', 'cru.roleId', 'cru.causeId', 'cru.createdAt')
    .from('causes_roles_users as cru')
    .whereIn('causeId', causes.map(cause => cause.id))
    .andWhereNot('userId', userId)
    .join('roles as r', 'r.id', 'roleId')
    .join('users as u', 'u.id', 'userId')
}

export default {
  create: UserRoles.create,
  update: UserRoles.update,
  findOne: UserRoles.findOne,
  promotable,
  getAll,
  forTask,
  forCause,
};
