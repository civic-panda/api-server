import * as React from 'react';
import * as BS from 'react-bootstrap';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';

import { AppState, causes, permissions, tasks } from '../../modules';

interface Props {
  task: tasks.Task;
  canEdit: boolean;
  canDelete: boolean;
  // publish(): void;
  // unpublish(): void;
  size?: BS.Sizes;
  floatRight?: boolean;
}

const ActionButtonComponent = (props: Props) => {
  return (
    <BS.SplitButton
      id={`action-button-${props.task.id}`}
      title="Edit"
      bsSize={props.size}
      disabled={!props.canEdit}
      onClick={() => hashHistory.push(`tasks/${props.task.id}`)}
      pullRight
    >
      <BS.MenuItem eventKey="1">Duplicate</BS.MenuItem>
      <BS.MenuItem divider />
      <BS.MenuItem eventKey="2" disabled={!props.canDelete}>Delete</BS.MenuItem>
    </BS.SplitButton>
  );
};

const mapStateToProps = (state: AppState, ownProps: Partial<Props>) => {
  const cause = causes.selectors.find('id', ownProps.task.causeId)(state);
  return {
    canEdit: permissions.can(cause.role, 'edit', 'task'),
    canDelete: permissions.can(cause.role, 'delete', 'task'),
  }
};

// const mapDispatchToProps = (dispatch: any, ownProps: Partial<Props>) => ({
  // publish: () => dispatch(tasks.update(ownProps.task)({ published: true })),
  // unpublish: () => dispatch(tasks.update(ownProps.task)({ published: false })),
// })

export const TaskActionButton = connect(mapStateToProps)(ActionButtonComponent);
