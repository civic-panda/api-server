import * as express from 'express';

import * as permissions from '../util/permissions';
import userRolesModel from '../models/UserRoles';
import roleModel from '../models/Roles';
import { wrapRequestHandler, wrapRequestParamHandler } from './catchAsyncErrors';

const getRoles: express.RequestHandler = async (_req, res, _next) => {
  const roles = await roleModel.getAll();
  res.json(roles);
}

const createRole = async (userId: string, causeId: string, roleName: string) => {
  const newRoleModels = await userRolesModel.create(userId, causeId, roleName);

  return { status: 201, body: newRoleModels }
}

const updateRole = async (userId: string, causeId: string, roleName: permissions.role) => {
  // TODO handle privaledges for demotions
  const newRoleModels = await userRolesModel.update(userId, causeId, roleName);

  return { status: 200, body: newRoleModels }
}

const createOrUpdateRole: express.RequestHandler = async (req, res, _next) => {
  const { causeId, userId, roleName } = req.body;

  const userIdToUpdate = userId || req.user.userId;
  const requesterRole = await userRolesModel.forCause(req.user.userId, causeId);
  const isPromotingSelf = userIdToUpdate === req.user.userId;
  const isPromotingSelfToVolunteer = isPromotingSelf && roleName === 'volunteer';
  const hasPermissionToPromote = permissions.canThisPromoteToThat(requesterRole, roleName as permissions.role);
  console.log(causeId, userId, roleName);
  console.log('isPromotingSelfToVolunteer || hasPermissionToPromote', isPromotingSelfToVolunteer, hasPermissionToPromote)
  if (!(isPromotingSelfToVolunteer || hasPermissionToPromote)) {
    throw { status: 403, message: 'you don\'t have permission to create that role' };
  }

  const existingRoleModel = await userRolesModel.findOne({ userId: userIdToUpdate, causeId });
  let response;

  if (existingRoleModel) {
    response = await updateRole(userIdToUpdate, causeId, roleName);
  } else {
    response = await createRole(userIdToUpdate, causeId, roleName);
  }

  res.status(response.status).json(response.body);
}

const getRoleParam: express.RequestParamHandler = async (req, _res, next, roleName) => {
  const role = await roleModel.findOne({ name: roleName });
  if (!role) throw { status: 404, message: 'that role does not exist' };
  req.params.role = role;
  return next();
}

const router = express.Router();

router
  .get('/', wrapRequestHandler(getRoles))
  .post('/', wrapRequestHandler(createOrUpdateRole))
  .param('roleName', wrapRequestParamHandler(getRoleParam))
  // .put('/:roleName', wrapRequestHandler(updateRole));

export default router;
