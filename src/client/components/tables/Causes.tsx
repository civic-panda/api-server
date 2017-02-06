import * as React from 'react';
import { hashHistory, Link } from 'react-router';

import { causes } from '../../modules';
import { RoleLabel } from '../ui';
import { Table } from './Table';

interface Props {
  causes: causes.Cause[];
}

export class Causes extends React.Component<Props, {}>{
  private columns = [
    {
      key: 'causeId',
      name: 'Cause',
      renderAs: (cause: causes.Cause) => (<Link to={`causes/${cause.id}`}>{cause.name}</Link>),
    }, {
      key: 'role',
      name: 'Role',
      renderAs: (cause: causes.Cause) => (<RoleLabel role={cause.role} />),
      sortAs: (cause: causes.Cause) => {
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
        onClick={(row) => hashHistory.push(`causes/${row.id}`)}
        initialDirection={'descending'}
        initialSort={'role'}
      />
    );
  }
}
