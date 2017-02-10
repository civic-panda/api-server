import db from '../db/schema';
import { Table } from '../db/knex';

type ReturnedColumns = 'id' | 'name' | 'causeId' | 'image' | 'summary' | 'startDate' | 'template' | 'templateProps' | 'endDate' | 'published';
const returnedColumns: ReturnedColumns[] = ['id', 'name', 'causeId', 'image', 'summary', 'startDate', 'template', 'templateProps', 'endDate', 'published']
const Task = new Table<db.tasks, ReturnedColumns>('tasks', returnedColumns);

export default {
  create: Task.create,
  find: Task.find,
  findIn: Task.findIn,
  findOne: Task.findOne,
  update: Task.update,
  destroy: Task.destroy,
};
