import * as express from 'express';

import causeModel from '../models/Cause';
import { wrapRequestHandler } from './catchAsyncErrors';

const getUnsubscribed: express.RequestHandler = async (_req, res) => {
  const causes = await causeModel.getAll();
  res.json(causes);
}

const router = express.Router();

router.get('/', wrapRequestHandler(getUnsubscribed))

export default router;