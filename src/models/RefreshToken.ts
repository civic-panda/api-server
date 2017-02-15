import db from '../db/schema';
import jwt from '../util/jwt';
import { Table } from '../db/knex';

type ReturnedColumns = 'id' | 'token' | 'userId' | 'name';
const returnedColumns: ReturnedColumns[] = ['id', 'token', 'userId', 'name']
const RefreshToken = new Table<db.refresh_tokens, ReturnedColumns>('refresh_tokens', returnedColumns);

const createRefreshToken = async ({ userId, name }: { userId: string, name?: string }) => {
  const token = await jwt.createRefreshToken();
  return await RefreshToken.create({ token, userId, name });
};

const findOrCreate = async ({ userId, name }: { userId: string, name?: string }) => {
  const foundToken = name ? await RefreshToken.findOne({ userId, name }) : await RefreshToken.findOne({ userId });
  return foundToken || await createRefreshToken({ userId, name });
};

export default {
  create: createRefreshToken,
  destroy: RefreshToken.destroy,
  findOne: RefreshToken.findOne,
  findOrCreate,
};
