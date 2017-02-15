import * as express from 'express';

import * as permissions from '../util/permissions';
import userRolesModel from '../models/UserRoles';
import causeModel from '../models/Cause';
import { wrapRequestHandler, wrapRequestParamHandler } from './catchAsyncErrors';

const getUnsubscribed: express.RequestHandler = async (_req, res) => {
  const causes = await causeModel.getAll();
  res.json(causes);
}

const getCauseParam: express.RequestParamHandler = async (req, _res, next, causeId) => {
  const cause = await causeModel.findOne({ id: causeId });
  if (!cause) throw { status: 404, message: 'that cause does not exist' };
  req.params.cause = cause;
  return next();
}

const getCause: express.RequestHandler = async (req, res, _next) => {
  res.json({ cause: req.params.cause });
}

const updateCause: express.RequestHandler = async (req, res, _next) => {
  const {
    name,
    callToAction,
    blurb,
    brandColor,
    logoImage,
    heroImage,
    placeholderImage,
    summary,
    facts,
    reading,
    published,
  } = req.body;
  // check permissions
  const userRole = await userRolesModel.forCause(req.user.userId, req.params.cause.id);
  if (!permissions.can(userRole, 'edit', 'cause')) {
    throw { status: 403, message: 'you don\'t have access to that cause' };
  }
  if (published !== undefined && published !== req.params.cause.published && !permissions.can(userRole, 'publish', 'cause')) {
    throw { status: 403, message: 'you don\'t have access to that cause' };
  }
  // update cause
  const cause = await causeModel.update(
    { id: req.params.cause.id },
    {
      name,
      callToAction,
      blurb,
      brandColor,
      logoImage,
      heroImage,
      placeholderImage,
      summary,
      facts,
      reading,
      published,
    }
  );
  res.json(cause);
}

const router = express.Router();

router.get('/', wrapRequestHandler(getUnsubscribed))
      .param('causeId', wrapRequestParamHandler(getCauseParam))
      .get('/:causeId', wrapRequestHandler(getCause))
      .put('/:causeId', wrapRequestHandler(updateCause))

export default router;