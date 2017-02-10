import db from '../db/schema';
import * as permissions from '../util/permissions';
import { Table, knexInstance } from '../db/knex';
import Task from './Task';
import Cause from './Cause';

type ReturnedColumns = 'id' | 'userId' | 'causeId' | 'roleName';
const returnedColumns: ReturnedColumns[] = ['id', 'userId', 'causeId', 'roleName']
const UserRoles = new Table<db.causes_roles_users, ReturnedColumns>('causes_roles_users', returnedColumns);

const getAll = (userId: string) => {
  return knexInstance
    .select('c.*', 'r.roleName as role')
    .from('causes as c')
    .joinRaw(`
      LEFT JOIN (
        SELECT *
        FROM causes_roles_users cru
        WHERE "userId" = '${userId}'
      ) r
      ON c.id = "causeId"
    `)
}

const forTask = async (userId: string, taskId: string) => {
  const { causeId } = await Task.findOne({ id: taskId });
  if (!causeId) throw 'Task does not exist';
  return forCause(userId, causeId);
}

const forCause = async (userId: string, causeId: string): Promise<permissions.role> => {
  return knexInstance
    .select('cru.roleName as role')
    .from('causes_roles_users as cru')
    .join('causes as c', 'c.id', 'causeId')
    .where('cru.userId', userId)
    .andWhere('cru.causeId', causeId)
    .then(roles => roles.length ? roles[0].role : undefined);
}

const promotable = async (userId: string, causes: { id: string }[]) => {
  return knexInstance
    .select('u.name as name', 'u.email as email', 'u.id as userId', 'cru.id as id', 'cru.roleName as role', 'cru.causeId', 'cru.createdAt')
    .from('causes_roles_users as cru')
    .whereIn('causeId', causes.map(cause => cause.id))
    .andWhereNot('userId', userId)
    .join('users as u', 'u.id', 'userId')
}

const create = async (userId: string, causeId: string, roleName: string) => {
  const cause = await Cause.findOne({ id: causeId });
  if (!cause) throw 'Cause does not exist';
  // Check if cause has a parent
  if (cause.parent) {
    const parentRole = await UserRoles.findOne({ userId, causeId: cause.parent });
    // Check if parent exists
    if (parentRole) {
      // Check if parent role if more senior
      if (permissions.isThisSeniorToThat(parentRole.roleName as permissions.role, roleName as permissions.role)) {
        // Create elevated child role
        return UserRoles.create({ userId, causeId, roleName: parentRole.roleName });
      }
    }
    // Volunteer to parent if not already
    UserRoles.create({ userId, causeId: cause.parent, roleName: 'volunteer' });
  }
  // Create requested child role
  return UserRoles.create({ userId, causeId, roleName });
}

export default {
  create,
  update: UserRoles.update,
  findOne: UserRoles.findOne,
  promotable,
  getAll,
  forTask,
  forCause,
};
