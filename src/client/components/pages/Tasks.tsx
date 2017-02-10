import * as React from 'react';
import * as BS from 'react-bootstrap';
import { connect } from 'react-redux';

import { AppState, causes, permissions, tasks } from '../../modules';
import CreateTask from '../forms/CreateTask';
import * as Tables from '../tables';
import { DownloadButton } from '../ui';

interface Props {
  causes: causes.Cause[];
  causesWithCreatePermission: causes.Cause[];
  tasks: tasks.Task[];
  createTask(): any;
}

interface State {
  isModalShowing: boolean;
}

class TasksPage extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { isModalShowing: false }
  }

  private showModal = () => this.setState({ isModalShowing: true })
  private hideModal = () => this.setState({ isModalShowing: false })

  private renderModal = () => (
    <BS.Modal show={this.state.isModalShowing} onHide={this.hideModal}>
      <BS.Modal.Header closeButton>
        <BS.Modal.Title>Create New Task</BS.Modal.Title>
      </BS.Modal.Header>
      <BS.Modal.Body>
        <CreateTask
          onSubmit={this.props.createTask}
          causes={this.props.causesWithCreatePermission}
          initialValues={{
            causeId: this.props.causesWithCreatePermission.length ? this.props.causesWithCreatePermission[0].id : undefined
          }}
        />
      </BS.Modal.Body>
    </BS.Modal>
  )

  public render() {
    const { tasks, causes, causesWithCreatePermission } = this.props;

    return (
      <BS.Col xs={12}>
        {this.renderModal()}
        <BS.PageHeader>
          Tasks
          <BS.ButtonToolbar className={'pull-right'}>
            <BS.Button
              onClick={this.showModal}
              className={'pull-right'}
              bsStyle={'primary'}
              disabled={causesWithCreatePermission.length === 0}
            >
              <BS.Glyphicon glyph={'plus-sign'} />&nbsp;
              Create New Task
            </BS.Button>
            <DownloadButton data={this.props.tasks} name={'tasks'} />
          </BS.ButtonToolbar>
        </BS.PageHeader>
        <Tables.Tasks tasks={tasks} causes={causes} />
      </BS.Col>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  const causeList = causes.selectors.list(state);
  console.log('causeList', causeList);
  const unsubscribed = causes.selectors.unsubscribed(state);
  console.log('unsubscribed', unsubscribed);
  const filteredCauseList = causeList.filter(cause => permissions.can(cause.roleName, 'create', 'task'));
  console.log('filteredCauseList', filteredCauseList);
  return {
    causes: [...causeList, ...unsubscribed],
    causesWithCreatePermission: filteredCauseList,
    tasks: tasks.selectors.list(state),
  };
};

const mapDispatchToProps = ({
  createTask: tasks.create
});

export const Tasks = connect(mapStateToProps, mapDispatchToProps)(TasksPage)
