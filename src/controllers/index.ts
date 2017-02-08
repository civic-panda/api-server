import * as express from 'express';

import jwt from '../middlewares/jwt';
import usersRouter from './users';
import causesRouter from './causes';
import tokensRouter from './tokens';
import tasksRouter from './tasks';
import rolesRouter from './roles';

const router = express.Router();

router.use('/tokens', tokensRouter);
router.use('/users', jwt.unless({ method: 'POST' }), usersRouter);
router.use('/causes', jwt.unless({ method: 'GET' }), causesRouter);
router.use('/tasks', jwt.unless({ method: 'GET' }), tasksRouter);
router.use('/roles', jwt.unless({ method: 'GET' }), rolesRouter);

export default router;
