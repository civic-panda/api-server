import * as express from 'express';

import * as permissions from '../util/permissions';
import userRolesModel from '../models/UserRoles';
import roleModel from '../models/Roles';
import { wrapRequestHandler, wrapRequestParamHandler } from './catchAsyncErrors';

const getRoles: express.RequestHandler = async (_req, res, _next) => {
  const roles = await roleModel.getAll();
  res.json(roles);
}

const createRole = async (userId: string, causeId: string, roleId: string) => {
  const newRoleModel = await userRolesModel.create({ userId, causeId, roleId });
  const { name: role } = await roleModel.findOne({ id: roleId });

  return { status: 201, body: { ...newRoleModel, role } }
}

const updateRole = async (id: string, userId: string, causeId: string, roleId: string) => {
  // TODO handle privaledges for demotions
  const newRoleModel = await userRolesModel.update({ id }, { userId, causeId, roleId });
  const { name: role } = await roleModel.findOne({ id: roleId });

  return { status: 200, body: { ...newRoleModel, role } }
}

const createOrUpdateRole: express.RequestHandler = async (req, res, _next) => {
  const { causeId, userId } = req.body;

  let roleId;
  let newRole;
  // Can pass either role name or id
  if (req.body.roleId) {
    roleId = req.body.roleId;
    const newRoleModel = await roleModel.findOne({ id: roleId });
    newRole = newRoleModel.name;
  } else {
    newRole = req.body.role;
    const newRoleModel = await roleModel.findOne({ name: newRole });
    roleId = newRoleModel.id;
  }

  const userIdToUpdate = userId || req.user.userId;
  const requesterRole = await userRolesModel.forCause(req.user.userId, causeId);

  const isPromotingSelf = userIdToUpdate === req.user.userId;
  const isPromotingSelfToVolunteer = isPromotingSelf && newRole === 'volunteer';
  const hasPermissionToPromote = permissions.canThisPromoteToThat(requesterRole, newRole as permissions.role);

  if (!(isPromotingSelfToVolunteer || hasPermissionToPromote)) {
    throw { status: 403, message: 'you don\'t have permission to create that role' };
  }

  const existingRoleModel = await userRolesModel.findOne({ userId, causeId });
  let response;

  if (existingRoleModel) {
    response = await updateRole(existingRoleModel.id, userIdToUpdate, causeId, roleId);
  } else {
    response = await createRole(userIdToUpdate, causeId, roleId);
  }

  res.status(response.status).json(response.body);
}

const getRoleParam: express.RequestParamHandler = async (req, _res, next, roleId) => {
  const role = await roleModel.findOne({ id: roleId });
  if (!role) throw { status: 404, message: 'that role does not exist' };
  req.params.role = role;
  return next();
}

const router = express.Router();

router
  .get('/', wrapRequestHandler(getRoles))
  .post('/', wrapRequestHandler(createOrUpdateRole))
  .param('roleId', wrapRequestParamHandler(getRoleParam))
  // .put('/:roleId', wrapRequestHandler(updateRole));

export default router;
