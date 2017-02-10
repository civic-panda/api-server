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
    .select('c.*', 'r.roleName')
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
    .select('cru.roleName')
    .from('causes_roles_users as cru')
    .join('causes as c', 'c.id', 'causeId')
    .where('cru.userId', userId)
    .andWhere('cru.causeId', causeId)
    .then(roles => roles.length ? roles[0].roleName : undefined);
}

const promotable = async (userId: string, causes: { id: string }[]) => {
  return knexInstance
    .select('u.name as name', 'u.email as email', 'u.id as userId', 'cru.id as id', 'cru.roleName', 'cru.causeId', 'cru.createdAt')
    .from('causes_roles_users as cru')
    .whereIn('causeId', causes.map(cause => cause.id))
    .andWhereNot('userId', userId)
    .join('users as u', 'u.id', 'userId')
}


// TODO Move create and update logic to DB triggers
const create = async (userId: string, causeId: string, roleName: string) => {
  const cause = await Cause.findOne({ id: causeId });
  if (!cause) throw 'Cause does not exist';

  const promotions: Partial<db.causes_roles_users>[] = [];

  // If no parent cause
  if (!cause.parent) {
    // Create requested child role
    const newPromotion = UserRoles.create({ userId, causeId, roleName });
    promotions.push(newPromotion);
    return promotions;
  }

  const parentRole = await UserRoles.findOne({ userId, causeId: cause.parent });
  // If user doesn't have a role in the parent cause
  if (!parentRole) {
    // Create volunteer role in parent
    const newParentPromotion = await UserRoles.create({ userId, causeId: cause.parent, roleName: 'volunteer' });
    promotions.push(newParentPromotion);
    // Create requested child role
    const newPromotion = UserRoles.create({ userId, causeId, roleName });
    promotions.push(newPromotion);
    return promotions;
  }

  // Check if parent role if more senior
  if (permissions.isThisSeniorToThat(parentRole.roleName as permissions.role, roleName as permissions.role)) {
    // Create elevated child role
    const newPromotion = UserRoles.create({ userId, causeId, roleName: parentRole.roleName });
    promotions.push(newPromotion);
    return promotions;
  } else {
    // Create requested child role
    const newPromotion = UserRoles.create({ userId, causeId, roleName });
    promotions.push(newPromotion);
    return promotions;
  }
}

const update = async (userId: string, causeId: string, roleName: permissions.role) => {
  const childrenCauses = await knexInstance
    .select('*')
    .from('causes as c')
    .leftJoin('causes_roles_users as cru', 'cru.causeId', 'c.id')
    .where('c.parent', causeId)
    .andWhere('cru.userId', userId);

  const promotions: Partial<db.causes_roles_users>[] = [];

  if (childrenCauses) {
    await Promise.all(childrenCauses.map(async (childCause: db.causes_roles_users) => {
      if (permissions.isThisSeniorToThat(roleName, childCause.roleName as permissions.role)) {
        const newChild = await UserRoles.update({ userId: childCause.userId, causeId: childCause.causeId }, { roleName });
        promotions.push(newChild);
      }
    }));
  }

  const newParent = await UserRoles.update({ userId, causeId }, { roleName });
  promotions.push(newParent);
  return promotions;
}

export default {
  create,
  update,
  findOne: UserRoles.findOne,
  promotable,
  getAll,
  forTask,
  forCause,
};
