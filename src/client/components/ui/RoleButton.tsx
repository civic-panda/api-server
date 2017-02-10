import * as React from 'react';
import * as BS from 'react-bootstrap';

import { role } from '../../../util/permissions';
import { colorMap } from './RoleLabel';

interface Props {
  id: string;
  roleName: role;
  promote?(): void;
  size?: BS.Sizes;
  canPromote?: boolean;
}

export const RoleButton = (props: Props) => (
  <BS.DropdownButton
    id={`promote-button-${props.id}`}
    title={props.roleName}
    bsStyle={colorMap[props.roleName]}
    bsSize={props.size}
    disabled={!props.canPromote}
    pullRight
  >
    <BS.MenuItem eventKey="1" onClick={props.promote}>Promote</BS.MenuItem>
  </BS.DropdownButton>
);
