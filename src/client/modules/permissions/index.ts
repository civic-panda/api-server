export type role = 'admin' | 'owner' | 'organizer' | 'volunteer';
export type permission = 'view' | 'create' | 'edit' | 'delete' | 'publish' | 'promote';
export type resource = 'cause' | 'task';

const getPermissions = (role: role): { cause: permission[], task: permission[] } => {
  switch (role) {
    case 'admin':
      return {
        cause: ['view', 'promote', 'create', 'edit', 'delete', 'publish'],
        task: ['view', 'create', 'edit', 'delete', 'publish'],
      }
    case 'owner':
      return {
        cause: ['view', 'promote', 'create', 'edit'],
        task: ['view', 'create', 'edit', 'delete', 'publish'],
      }
    case 'organizer':
      return {
        cause: ['view', 'promote'],
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

const isThisSeniorToThat = (thisRole: role, thatRole: role): boolean => {
  switch (thisRole) {
    case 'admin':
      if (thatRole === 'volunteer' || thatRole === 'organizer' || thatRole === 'owner') {
        return true;
      } else {
        return false;
      }
    case 'owner': {
      if (thatRole === 'volunteer' || thatRole === 'organizer') {
        return true;
      } else {
        return false;
      }
    }
    case 'organizer': {
      if (thatRole === 'volunteer') {
        return true;
      } else {
        return false;
      }
    }
    case 'volunteer':
    default:
      return false
  }
}

const canThisPromoteToThat = (thisRole: role, thatRole: role): boolean => {
  const areEquivalent = thisRole === thatRole;
  return isThisSeniorToThat(thisRole, thatRole) || areEquivalent;
}

export {
  getPermissions as get,
  can,
  isThisSeniorToThat,
  canThisPromoteToThat,
}
