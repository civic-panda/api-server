import db from '../db/schema';
import { Table } from '../db/knex';

type ReturnedColumns = 'id' | 'name';
const returnedColumns: ReturnedColumns[] = ['id', 'name']
const Cause = new Table<db.causes, ReturnedColumns>('causes', returnedColumns);

export default {
  create: Cause.create,
  find: Cause.find,
  findOne: Cause.findOne,
  update: Cause.update,
  destroy: Cause.destroy,
};
