import * as jwt from 'express-jwt';
import config from '../config';

export const optionalJwt = jwt({ secret: config.JWT_PRIVATE_KEY, credentialsRequired: false });
export default jwt({ secret: config.JWT_PRIVATE_KEY });
