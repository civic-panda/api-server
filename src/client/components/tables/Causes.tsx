import * as React from 'react';
import { Link } from 'react-router';
import * as BS from 'react-bootstrap';

import { createUrl } from '../../util/cloudinaryUrl';
import { causes } from '../../modules';
import { RoleLabel } from '../ui';
import { Nested } from './Nested';
import { Column } from './Columns';

interface Props {
  causes: causes.Cause[];
}

export class Causes extends React.Component<Props, {}>{
  private columns: Column<causes.Cause>[] = [
    {
      key: 'logoImage',
      name: 'Logo',
      width: '40px',
      renderAs: cause => (
        <BS.Image
          src={createUrl(cause.logoImage, { height: '40', width: '40', crop: 'fit' })}
          alt="picture to upload"
          style={{ maxHeight: '40px', maxWidth: '40px' }}
        />
      ),
    }, {
      key: 'causeId',
      name: 'Cause',
      renderAs: cause => (<Link to={`causes/${cause.id}`}>{cause.name}</Link>),
    }, {
      key: 'role',
      name: 'Role',
      renderAs: cause => (<RoleLabel role={cause.role} />),
      sortAs: cause => {
        switch (cause.role) {
          case 'admin': return 3;
          case 'owner': return 2;
          case 'organizer': return 1;
          default: return 0;
        }
      }
    },
  ];

  public render() {
    const { causes } = this.props;
    return (
      <Nested
        columns={this.columns}
        rows={causes}
        initialDirection={'descending'}
        initialSort={'role'}
      />
    );
  }
}
