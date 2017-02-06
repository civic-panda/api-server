import { knexInstance } from '../db/knex';
import Task from './Task';

const getAll = (userId: string) => {
  /*
    SELECT
      c.id,
      c.name,
      c.logo,
      r.name as role
    FROM
      causes_roles_users cru
      INNER JOIN causes c ON c.id = cru."causeId"
      INNER JOIN roles r ON r.id = cru."roleId"
    WHERE
      "userId" = `${userId}`
  */
  return knexInstance
    .select('c.id', 'c.name', 'c.logo', 'r.name as role')
    .from('causes_roles_users as cru')
    .join('causes as c', 'c.id', 'causeId')
    .join('roles as r', 'r.id', 'roleId')
    .where('cru.userId', userId)
}

const forTask = async (userId: string, taskId: string) => {
  const { causeId } = await Task.findOne({ id: taskId });
  if (!causeId) throw 'Task does not exist';
  return forCause(userId, causeId);
}

const forCause = async (userId: string, causeId: string) => {
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
    .then(roles => roles[0].role);
}

export default {
  getAll,
  forTask,
  forCause,
};
