import * as express from 'express';

// import jwt from '../util/jwt';
import userModel from '../models/User';
// import refreshTokenModel from '../models/RefreshToken';
import { wrapRequestHandler } from './catchAsyncErrors';

const authenticateUser: express.RequestHandler = async (req, res, _next) => {
  const { email, password, deviceName } = req.body;
  const user = await userModel.authenticate(email.toLowerCase(), password);
  if (!user) throw { status: 403, message: 'incorrect email or password' };
  const tokens = await userModel.getTokens(user, deviceName);
  if (!tokens) throw { status: 500, message: 'error creating tokens' };
  res.status(201).json({ ...tokens, userId: user.id })
}

const router = express.Router();

router
  .post('/', wrapRequestHandler(authenticateUser))
  // .put('/', async ctx => {
  //   // Refresh token
  //   const { refreshToken: requestedToken, name } = ctx.request.body;
  //   ctx.assert(requestedToken, 400, 'token required');
  //   const refreshToken = await refreshTokenModel.findOne({ token: requestedToken, name });
  //   console.log('finding ', requestedToken, name, refreshToken);
  //   ctx.assert(refreshToken, 404, 'token doesn\'t exist');
  //   const newToken = jwt.createToken({ userId: refreshToken.userId });
  //   ctx.body = { token: newToken };
  // })
  // .delete('/', async ctx => {
  //   const { refreshToken: requestedToken, name } = ctx.request.body.refreshToken;
  //   const refreshToken = await refreshTokenModel.findOne({ token: requestedToken, name });
  //   ctx.assert(refreshToken, 404, 'token doesn\'t exist');
  //   await refreshTokenModel.destroy({ id: refreshToken.id });
  //   ctx.status = 200;
  // });

export default router;
