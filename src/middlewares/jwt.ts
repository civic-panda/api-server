import * as jwt from 'express-jwt';
import config from '../config';

export const optionalJwt = jwt({ secret: config.jwtSecret, credentialsRequired: false });
export default jwt({ secret: config.jwtSecret });
