export type role = 'admin' | 'owner' | 'organizer' | 'volunteer';
export type permission = 'view' | 'create' | 'edit' | 'delete' | 'publish';
export type resource = 'cause' | 'task';

const getPermissions = (role: role): { cause: permission[], task: permission[] } => {
  switch (role) {
    case 'admin':
      return {
        cause: ['view', 'create', 'edit', 'delete', 'publish'],
        task: ['view', 'create', 'edit', 'delete', 'publish'],
      }
    case 'owner':
      return {
        cause: ['view', 'create', 'edit'],
        task: ['view', 'create', 'edit', 'delete', 'publish'],
      }
    case 'organizer':
      return {
        cause: ['view'],
        task: ['view', 'create', 'edit'],
      }
    case 'volunteer':
    default:
      return {
        cause: ['view'],
        task: ['view'],
      }
  }
}

const can = (role: role, permission: permission, resource: resource) =>
  getPermissions(role)[resource].some((item: permission) => item === permission);

export {
  getPermissions as get,
  can,
}
