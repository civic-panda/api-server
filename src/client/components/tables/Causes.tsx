import * as React from 'react';
import { Link } from 'react-router';

import { causes } from '../../modules';
import { RoleLabel } from '../ui';
import { Table } from './Table';
import { Column } from './Columns';

interface Props {
  causes: causes.Cause[];
}

export class Causes extends React.Component<Props, {}>{
  private columns: Column<causes.Cause>[] = [
    {
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
      <Table
        columns={this.columns}
        rows={causes}
        initialDirection={'descending'}
        initialSort={'role'}
      />
    );
  }
}
