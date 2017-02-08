import * as jwt from 'express-jwt';
import { JWT_PRIVATE_KEY } from '../config';

export const optionalJwt = jwt({ secret: JWT_PRIVATE_KEY, credentialsRequired: false });
export default jwt({ secret: JWT_PRIVATE_KEY });
