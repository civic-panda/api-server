import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

import config from '../config';

const jwtConfig = {
  expiresIn: '30m',
  issuer: 'Act On This',
};

export interface Payload {
  userId: string;
  type: 'BEARER' | 'RESET_PASSWORD',
}

const createToken = (payload: Payload, optConfig?: Object) => jwt.sign(
  payload,
  config.jwtSecret,
  { ...jwtConfig, ...optConfig }
);

const decodeToken = (token: string) => jwt.verify(token, config.jwtSecret);

const createRefreshToken = () => crypto.randomBytes(64).toString('hex');

export default {
  createToken,
  decodeToken,
  createRefreshToken,
};
