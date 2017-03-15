import * as express from 'express';

import demoRequestModel from '../models/DemoRequest';
import { wrapRequestHandler } from './catchAsyncErrors';

const createTask: express.RequestHandler = async (req, res, _next) => {
  const { name, email, phoneNumber } = req.body;

  const demoRequest = await demoRequestModel.create({ name, email, phoneNumber });
  res.status(201).json(demoRequest);
}

const router = express.Router();

router
  .post('/', wrapRequestHandler(createTask))

export default router;
