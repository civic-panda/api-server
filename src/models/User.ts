import db from '../db/schema';
import err from '../util/errors';
import jwt from '../util/jwt';
import auth from '../util/auth';
import { Table, findOne } from '../db/knex';
import RefreshToken from './RefreshToken';

type ReturnedColumns = 'id' | 'email' | 'name';
const returnedColumns: ReturnedColumns[] = ['id', 'email', 'name']
const User = new Table<db.users, ReturnedColumns>('users', returnedColumns);

const checkPassword = async (user: { password: string }, plainTextPass: string) => {
  const hashedPass = user.password;
  return await auth.compareHash(plainTextPass, hashedPass);
};

const validateEmail = (email: string) => {
  const isValid = /\S+@\S+\.\S+/.test(email);
  if (!isValid) throw err.create(err.types.badRequest, 'valid email required');
  return true;
};

const validatePassword = (pass: string) => {
  const isValid = typeof pass === 'string' && pass.length;
  if (!isValid) throw err.create(err.types.badRequest, 'password required');
  return true;
};

const authenticateUser = async (email: string, plainTextPass: string) => {
  validateEmail(email);
  validatePassword(plainTextPass);

  const user = await findOne<db.users, ReturnedColumns | 'password'>('users', { select: [...returnedColumns, 'password'], where: { email: email.toLowerCase() } });
  if (!user) throw err.create(err.types.notFound, 'user doesn\'t exist');

  const passwordMatches = await checkPassword(user, plainTextPass);
  if (!passwordMatches) throw err.create(err.types.badRequest, 'wrong password');

  return user;
};

const createUser = async (email: string, plainTextPass: string, name: string) => {
  validateEmail(email);
  validatePassword(plainTextPass);

  const userExists = await User.findOne({ email });
  if (userExists) throw err.create(err.types.conflict, 'user already exists');
  const hashedPass = await auth.createHash(plainTextPass);

  return await User.create({ email, password: hashedPass, name });
};

const getTokensForUser = async (user: Partial<db.users>, deviceName?: string) => {
  const refreshToken = await RefreshToken.findOrCreate({ userId: user.id, name: deviceName });
  const tokens = {
    token: jwt.createToken({ userId: user.id, type: 'BEARER' }),
    refreshToken: refreshToken.token,
  };

  return tokens;
};

export default {
  authenticate: authenticateUser,
  create: createUser,
  findIn: User.findIn,
  findOne: User.findOne,
  getTokens: getTokensForUser,
  update: User.update,
};
