import * as React from 'react';
import * as BS from 'react-bootstrap';
import { connect } from 'react-redux';

import { AppState, causes, permissions, tasks } from '../../modules';

interface Props {
  task: tasks.Task;
  canPublish: boolean;
  publish(): void;
  unpublish(): void;
  size?: BS.Sizes;
  floatRight?: boolean;
}

const PublishButtonComponent = (props: Props) => {
  return props.task.published
    ? (
      <div className={props.floatRight ? 'pull-right' : ''}>
        <BS.DropdownButton
          id={`unpublish-button-${props.task.id}`}
          title={'Published'}
          bsStyle="success"
          bsSize={props.size}
          disabled={!props.canPublish}
          pullRight
        >
          <BS.MenuItem eventKey="1" onClick={props.unpublish}>Unpublish</BS.MenuItem>
        </BS.DropdownButton>
      </div>
    ) : (
      <div className={props.floatRight ? 'pull-right' : ''}>
        <BS.DropdownButton
          id={`publish-button-${props.task.id}`}
          title={'Not published'}
          bsStyle="link"
          bsSize={props.size}
          disabled={!props.canPublish}
          pullRight
        >
          <BS.MenuItem eventKey="1" onClick={props.publish}>Publish</BS.MenuItem>
        </BS.DropdownButton>
      </div>
    );
};

const mapStateToProps = (state: AppState, ownProps: Partial<Props>) => {
  const cause = causes.selectors.find('id', ownProps.task.causeId)(state);
  return {
    canPublish: permissions.can(cause.role, 'publish', 'task'),
  }
};

const mapDispatchToProps = (dispatch: any, ownProps: Partial<Props>) => ({
  publish: () => dispatch(tasks.update(ownProps.task)({ published: true })),
  unpublish: () => dispatch(tasks.update(ownProps.task)({ published: false })),
})

export const TaskPublishButton = connect(mapStateToProps, mapDispatchToProps)(PublishButtonComponent);
