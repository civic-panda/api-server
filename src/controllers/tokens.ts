import * as express from 'express';

import jwt from '../util/jwt';
import userModel from '../models/User';
import refreshTokenModel from '../models/RefreshToken';
import { wrapRequestHandler } from './catchAsyncErrors';

const authenticateUser: express.RequestHandler = async (req, res, _next) => {
  const { email, password, deviceName } = req.body;
  const user = await userModel.authenticate(email.toLowerCase(), password);
  if (!user) throw { status: 403, message: 'incorrect email or password' };
  const tokens = await userModel.getTokens(user, deviceName);
  if (!tokens) throw { status: 500, message: 'error creating tokens' };
  res.status(201).json({ ...tokens, userId: user.id })
}

const refreshToken: express.RequestHandler = async (req, res) => {
  const { refreshToken: requestedToken, name } = req.body;
  if (!requestedToken) throw { status: 400, message: 'token required' };
  const refreshToken = await refreshTokenModel.findOne({ token: requestedToken, name });
  if (!refreshToken) throw { status: 404, message: 'token doesn\'t exist' };
  const newToken = jwt.createToken({ userId: refreshToken.userId, type: 'BEARER' });
  res.status(201).json({ token: newToken });
}

const router = express.Router();

router
  .post('/', wrapRequestHandler(authenticateUser))
  .put('/', wrapRequestHandler(refreshToken))
  // .delete('/', async ctx => {
  //   const { refreshToken: requestedToken, name } = ctx.request.body.refreshToken;
  //   const refreshToken = await refreshTokenModel.findOne({ token: requestedToken, name });
  //   ctx.assert(refreshToken, 404, 'token doesn\'t exist');
  //   await refreshTokenModel.destroy({ id: refreshToken.id });
  //   ctx.status = 200;
  // });

export default router;
