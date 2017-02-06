import * as jwt from 'express-jwt';
import { JWT_PRIVATE_KEY } from '../config';

export default jwt({ secret: JWT_PRIVATE_KEY });
