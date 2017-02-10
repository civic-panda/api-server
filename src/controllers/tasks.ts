import * as express from 'express';

import * as permissions from '../util/permissions';
import userRolesModel from '../models/UserRoles';
import taskModel from '../models/Task';
import { wrapRequestHandler, wrapRequestParamHandler } from './catchAsyncErrors';

const createTask: express.RequestHandler = async (req, res, _next) => {
  const { name, causeId, ...otherProps } = req.body;

  const userRole = await userRolesModel.forCause(req.user.userId, causeId);
  if (!permissions.can(userRole, 'create', 'task')) {
    throw { status: 403, message: 'you don\'t have permission to create tasks' };
  }

  if (!name) throw { status: 400, message: 'name required' };
  if (!causeId) throw { status: 400, message: 'cause required' };

  const task = await taskModel.create({ name, causeId, ...otherProps, published: false });
  res.status(201).json(task);
}

const getTaskParam: express.RequestParamHandler = async (req, _res, next, taskId) => {
  // get task
  const task = await taskModel.findOne({ id: taskId });
  if (!task) throw { status: 404, message: 'that task does not exist' };
  req.params.task = task;
  return next();
}

const getTask: express.RequestHandler = async (req, res, _next) => {
  res.json({ task: req.params.task });
}

const updateTask: express.RequestHandler = async (req, res, _next) => {
  const {
    name,
    image,
    tags,
    summary,
    location,
    duration,
    startDate,
    endDate,
    published,
    template,
    templateProps,
  } = req.body;
  // check permissions
  const userRole = await userRolesModel.forTask(req.user.userId, req.params.task.id);
  if (!permissions.can(userRole, 'edit', 'task')) {
    throw { status: 403, message: 'you don\'t have access to that task' };
  }
  if (published !== undefined && published !== req.params.task.published && !permissions.can(userRole, 'publish', 'task')) {
    throw { status: 403, message: 'you don\'t have access to that task' };
  }
  // update task
  const task = await taskModel.update(
    { id: req.params.task.id },
    {
      name,
      image,
      tags,
      summary,
      location,
      duration,
      startDate,
      endDate,
      published,
      template,
      templateProps,
    }
  );
  res.json(task);
}

const router = express.Router();

router
  .post('/', wrapRequestHandler(createTask))
  .param('taskId', wrapRequestParamHandler(getTaskParam))
  .get('/:taskId', wrapRequestHandler(getTask))
  .put('/:taskId', wrapRequestHandler(updateTask));

export default router;
