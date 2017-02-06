import * as express from 'express';

import userModel from '../models/User';
import userRolesModel from '../models/UserRoles';
import taskModel from '../models/Task';
import { wrapRequestHandler, wrapRequestParamHandler } from './catchAsyncErrors';

const createUser: express.RequestHandler = async (req, res, _next) => {
  const { email, password, name, deviceName } = req.body;

  if (!email) throw { status: 400, message: 'email required' };
  if (!password) throw { status: 400, message: 'password required' };

  const user = await userModel.create(email.toLowerCase(), password, name);
  const tokens = await userModel.getTokens(user, deviceName);

  res.status(201).json({ ...tokens, userId: user.id });
}

const getUserParam: express.RequestParamHandler = async (req, _res, next, userId) => {
  const matchesToken = userId === req.user.userId;
  if (!matchesToken) throw { status: 403, message: 'you don\'t have access to that user' };
  const user = await userModel.findOne({ id: userId });
  if (!user) throw { status: 404, message: 'that user does not exist' };
  req.params.user = user;
  return next();
}

const getUser: express.RequestHandler = async (req, res, _next) => {
  const causes = await userRolesModel.getAll(req.params.user.id);
  const tasks = await taskModel.findIn('causeId', causes.map((cause: any) => cause.id));
  res.json({ user: req.params.user, causes, tasks });
}

const updateUser: express.RequestHandler = async (req, res, _next) => {
  const { email, name, phoneNumber } = req.body;
  const user = await userModel.update({ id: req.params.user.id }, { email, name, phoneNumber });
  res.json(user);
}

const router = express.Router();

router
  .post('/', wrapRequestHandler(createUser))
  .param('userId', wrapRequestParamHandler(getUserParam))
  .get('/:userId', wrapRequestHandler(getUser))
  .put('/:userId', wrapRequestHandler(updateUser));

export default router;
