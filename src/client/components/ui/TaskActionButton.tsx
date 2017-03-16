import * as React from 'react';
import * as BS from 'react-bootstrap';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';

import { AppState, causes, permissions, tasks } from '../../modules';

interface Props {
  task: tasks.Task;
  canEdit: boolean;
  canDelete: boolean;
  duplicate(props: any): void;
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
      <BS.MenuItem
        eventKey="1"
        onClick={() => props.duplicate({ ...props.task, id: undefined })}
      >
        Duplicate
      </BS.MenuItem>
      <BS.MenuItem divider />
      <BS.MenuItem eventKey="2" disabled={!props.canDelete}>Delete</BS.MenuItem>
    </BS.SplitButton>
  );
};

const mapStateToProps = (state: AppState, ownProps: Partial<Props>) => {
  const cause = causes.selectors.find('id', ownProps.task.causeId)(state);
  return {
    canEdit: permissions.can(cause.roleName, 'edit', 'task'),
    canDelete: permissions.can(cause.roleName, 'delete', 'task'),
  }
};

export const TaskActionButton = connect(mapStateToProps)(ActionButtonComponent);
