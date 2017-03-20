import * as React from 'react';
import { Link } from 'react-router';
import * as moment from 'moment';
import * as BS from 'react-bootstrap';

import { causes, tasks } from '../../modules';
import { RoleLabel, TaskPublishButton, TaskActionButton } from '../ui';
import CreateTask from '../forms/CreateTask';
import { Table } from './Table';
import { Column } from './Columns';

interface Props {
  causes: causes.Cause[];
  tasks: tasks.Task[];
  createTask(): any;
}

interface State {
  showModal: boolean;
  modalValues: Partial<tasks.Task>;
}

export class Tasks extends React.Component<Props, State>{
  public constructor(props: Props) {
    super(props);
    this.state = { showModal: false, modalValues: {} };
  }

  private showModal = (modalValues: Partial<tasks.Task>) => {
    console.log('showModal', modalValues);
    this.setState({ showModal: true, modalValues });
  }
  private hideModal = () => this.setState({ showModal: false, modalValues: {} })

  private renderModal = () => (
    <BS.Modal show={this.state.showModal} onHide={this.hideModal}>
      <BS.Modal.Header closeButton>
        <BS.Modal.Title>Create New Task</BS.Modal.Title>
      </BS.Modal.Header>
      <BS.Modal.Body>
        <CreateTask
          onSubmit={this.props.createTask}
          causes={this.props.causes}
          initialValues={this.state.modalValues}
        />
      </BS.Modal.Body>
    </BS.Modal>
  )

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
      renderAs: task => (<TaskActionButton task={task} size={'small'} duplicate={this.showModal} />),
    }];

  public render() {
    const { tasks } = this.props;
    return (
      <div>
        {this.renderModal()}
        <Table
          columns={this.columns}
          rows={tasks}
          initialDirection={'descending'}
          initialSort={'startDate'}
        />
      </div>
    );
  }
}
