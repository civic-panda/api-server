import * as React from 'react';
import * as BS from 'react-bootstrap';

import { permissions } from '../../modules';

interface Props extends BS.LabelProps {
  roleName: permissions.role,
  label?: string,
}

export const colorMap = {
  admin: 'danger',
  owner: 'success',
  organizer: 'info',
  volunteer: 'default',
}

export const RoleLabel = ({ label, roleName, ...otherProps }: Props) => (
  <BS.Label bsStyle={colorMap[roleName]} {...otherProps}>
    {label || roleName}
  </BS.Label>
);
