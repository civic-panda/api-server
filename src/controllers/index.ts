import * as express from 'express';

import jwt from '../middlewares/jwt';
import usersRouter from './users';
import causesRouter from './causes';
import tokensRouter from './tokens';
import tasksRouter from './tasks';

const router = express.Router();

router.use('/tokens', tokensRouter);
router.use('/users', jwt.unless({ method: 'POST' }), usersRouter);
router.use('/causes', jwt.unless({ method: 'GET' }), causesRouter);
router.use('/tasks', jwt.unless({ method: 'GET' }), tasksRouter);

export default router;
