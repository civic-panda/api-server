import * as React from 'react';
import { Link } from 'react-router';
import * as moment from 'moment';

import { causes, tasks } from '../../modules';
import { RoleLabel, TaskPublishButton, TaskActionButton } from '../ui';
import { Table } from './Table';
import { Column } from './Columns';

interface Props {
  causes: causes.Cause[];
  tasks: tasks.Task[];
}

export class Tasks extends React.Component<Props, {}>{
  private columns: Column<tasks.Task>[] = [
    {
      key: 'name',
      name: 'Task',
      renderAs: task => (<Link to={`tasks/${task.id}`}>{task.name}</Link>),
      sortAs: task => task.name,
    }, {
      key: 'causeId',
      name: 'Cause',
      renderAs: task => {
        const cause = this.props.causes.find(cause => cause.id === task.causeId);
        return (<Link to={`causes/${cause.id}`}>{cause.name}</Link>);
      },
      sortAs: task => {
        const cause = this.props.causes.find(cause => cause.id === task.causeId);
        return cause.name;
      },
    }, {
      key: 'roleName',
      name: 'Role',
      renderAs: task => {
        const cause = this.props.causes.find(cause => cause.id === task.causeId);
        return (<RoleLabel roleName={cause.roleName} />);
      },
      sortAs: task => {
        const cause = this.props.causes.find(cause => cause.id === task.causeId);
        switch (cause.roleName) {
          case 'admin': return 3;
          case 'owner': return 2;
          case 'organizer': return 1;
          default: return 0;
        }
      },
      hiddenAt: ['xs', 'sm'],
    }, {
      key: 'startDate',
      name: 'Start Date',
      renderAs: task => moment(task.startDate).format('LL'),
      sortAs: task => moment(task.startDate).valueOf(),
      hiddenAt: ['xs', 'sm'],
    }, {
      key: 'endDate',
      name: 'End Date',
      renderAs: task => moment(task.endDate).format('LL'),
      sortAs: task => moment(task.endDate).valueOf(),
      hiddenAt: ['xs', 'sm'],
    }, {
      key: 'published',
      name: 'Published',
      renderAs: task => (<TaskPublishButton task={task} size={'small'} />),
      sortAs: task => task.published ? 1 : 0,
      hiddenAt: ['xs'],
    }, {
      key: 'actions',
      name: 'Actions',
      renderAs: task => (<TaskActionButton task={task} size={'small'} />),
    }];

  public render() {
    const { tasks } = this.props;
    return (
      <Table
        columns={this.columns}
        rows={tasks}
        initialDirection={'descending'}
        initialSort={'startDate'}
      />
    );
  }
}
