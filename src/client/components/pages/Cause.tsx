import * as React from 'react';
import * as BS from 'react-bootstrap';
import { connect } from 'react-redux';

import { AppState, causes, permissions } from '../../modules';
import CauseForm from '../forms/Cause';

interface Props {
  cause: causes.Cause;
  canEdit: boolean;
  params: any;
  router: any;
  route: any;
}

interface State {
  tab: 'cause' | 'tasks';
}

class CauseComponent extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      tab: 'cause',
    };
  }

  public switchTab = (selectedKey: any) => this.setState({ tab: selectedKey })
  private setOnLeaveHook = (isDirty: () => boolean) => this.props.router.setRouteLeaveHook(this.props.route, () => {
    if (isDirty()) { return 'You have unsaved information, are you sure you want to leave this page?'; }
  })

  public render() {
    return (
      <BS.Col xs={12}>
        <BS.PageHeader>
          {this.props.cause.name}
        </BS.PageHeader>
        {this.props.canEdit
          ? (
            <BS.Col xs={12} sm={10} smOffset={1} md={8} mdOffset={2} lg={6} lgOffset={3}>
              <CauseForm cause={this.props.cause} setOnLeaveHook={this.setOnLeaveHook} />
            </BS.Col>
          ) : 'Cannot edit this cause'
        }
      </BS.Col>
    );
  }
}

const mapStateToProps = (state: AppState, ownProps: Partial<Props>) => {
  const cause = causes.selectors.find('id', ownProps.params.causeId)(state);
  return {
    cause,
    canEdit: permissions.can(cause.roleName, 'edit', 'cause'),
  }
}

export const Cause = connect(mapStateToProps)(CauseComponent);
