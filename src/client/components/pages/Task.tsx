import * as React from 'react';
import * as BS from 'react-bootstrap';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { AppState, causes, tasks, permissions } from '../../modules';
import { TaskPublishButton } from '../ui';
import TaskForm from '../forms/Task';

interface Props {
  task: tasks.Task;
  cause: causes.Cause;
  params: any;
  router: any;
  route: any;
  canEdit: boolean;
}

const TaskComponent = ({ cause, canEdit, task, router, route }: Props) => {
  const setOnLeaveHook = (isDirty: () => boolean) => router.setRouteLeaveHook(route, () => {
    if (isDirty()) { return 'You have unsaved information, are you sure you want to leave this page?'; }
  })

  return (
    <BS.Col xs={12}>
      <BS.PageHeader>
        {task.name} <Link to={`/causes/${cause.id}`}><small>{cause.name}</small></Link>
        <TaskPublishButton task={task} floatRight />
      </BS.PageHeader>
      {canEdit
        ? (
          <BS.Col xs={12} sm={10} smOffset={1} md={8} mdOffset={2} lg={6} lgOffset={3}>
            <TaskForm task={task} setOnLeaveHook={setOnLeaveHook} />
          </BS.Col>
        ) : 'Cannot edit this task'
      }
    </BS.Col>
  );
};

const mapStateToProps = (state: AppState, ownProps: Partial<Props>) => {
  const task = tasks.selectors.find(state, 'id', ownProps.params.taskId);
  const cause = causes.selectors.find('id', task.causeId)(state);

  return {
    task,
    cause,
    canEdit: permissions.can(cause.roleName, 'edit', 'task'),
  };
};

export const Task = connect(mapStateToProps)(TaskComponent);