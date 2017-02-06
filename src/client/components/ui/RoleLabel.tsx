import * as React from 'react';
import * as BS from 'react-bootstrap';

import { permissions } from '../../modules';

interface Props extends BS.LabelProps {
  role: permissions.role,
  label?: string,
}

const colorMap = {
  admin: 'danger',
  owner: 'success',
  organizer: 'info',
  volunteer: 'default',
}

export const RoleLabel = ({ label, role, ...otherProps }: Props) => (
  <BS.Label bsStyle={colorMap[role]} {...otherProps}>
    {label || role}
  </BS.Label>
);
