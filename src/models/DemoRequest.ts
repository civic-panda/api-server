import db from '../db/schema';
import { Table } from '../db/knex';

type ReturnedColumns = 'id' | 'email' | 'name' | 'phoneNumber';
const returnedColumns: ReturnedColumns[] = ['id', 'email', 'name', 'phoneNumber']
const DemoRequest = new Table<db.demo_requests, ReturnedColumns>('demo_requests', returnedColumns);

export default {
  create: DemoRequest.create,
};
