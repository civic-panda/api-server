import db from '../db/schema';
import { Table, knexInstance } from '../db/knex';

type ReturnedColumns = 'id' | 'name';
const returnedColumns: ReturnedColumns[] = ['id', 'name']
const Role = new Table<db.tasks, ReturnedColumns>('roles', returnedColumns);

const getAll = async () => {
  return knexInstance
    .select('id', 'name')
    .from('roles')
}

export default {
  getAll,
  create: Role.create,
  find: Role.find,
  findIn: Role.findIn,
  findOne: Role.findOne,
  update: Role.update,
  destroy: Role.destroy,
};
