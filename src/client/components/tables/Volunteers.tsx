import * as React from 'react';
import * as moment from 'moment';
import { hashHistory } from 'react-router';

import { causes, volunteers, permissions } from '../../modules';
import { RoleButton } from '../ui';
import { Table } from './Table';
import { Column } from './Columns';

interface Props {
  volunteers: volunteers.Volunteer[];
  causes: causes.Cause[];
}

export class Volunteers extends React.Component<Props, {}>{
  private columns: Column<volunteers.Volunteer>[] = [
    {
      key: 'name',
      name: 'Name',
      hiddenAt: ['xs'],
    }, {
      key: 'email',
      name: 'Email',
    }, {
      key: 'cause',
      name: 'Cause',
      renderAs: row => this.props.causes.find(cause => cause.id === row.causeId).name,
      sortAs: row => this.props.causes.find(cause => cause.id === row.causeId).name,
      hiddenAt: ['xs'],
    }, {
      key: 'role',
      name: 'Role',
      renderAs: row => {
        const cause = this.props.causes.find(cause => cause.id === row.causeId);
        return (
          <RoleButton
            id={row.id}
            canPromote={permissions.canThisPromoteToThat(cause.role, row.role)}
            role={row.role}
            size={'small'}
            promote={() => console.log('promote', row, cause)}
          />
      )},
      sortAs: row => {
        switch (row.role) {
          case 'admin': return 3;
          case 'owner': return 2;
          case 'organizer': return 1;
          default: return 0;
        }
      }
    }, {
      key: 'createdAt',
      name: 'Joined',
      renderAs: row => moment(row.createdAt).format('LL'),
      sortAs: row => moment(row.createdAt).valueOf(),
      hiddenAt: ['xs', 'sm'],
    }
  ];

  public render() {
    const { volunteers } = this.props;
    return (
      <Table
        columns={this.columns}
        rows={volunteers}
        onClick={(row) => hashHistory.push(`causes/${row.id}`)}
        initialDirection={'descending'}
        initialSort={'createdAt'}
      />
    );
  }
}
