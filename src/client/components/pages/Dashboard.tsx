import * as React from 'react';
import * as BS from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { AppState, auth, user, causes, tasks } from '../../modules';

interface Props {
  isUserLoaded: boolean;
  user: user.State;
  causes: causes.Cause[];
  tasks: tasks.Task[];
  userId: string;
  loadUser(userId: string): any;
}

class DashboardComponent extends React.Component<Props, {}>{
  public componentDidMount() {
    this.props.loadUser(this.props.userId);
  }

  public render() {
    return (
      <BS.Col xs={12}>
        <BS.PageHeader>
          {this.props.user.name}'s Dashboard
        </BS.PageHeader>
        <BS.Panel>
          <Link to={'/causes'}><h2>Causes</h2></Link>
          <p>High-level metrics coming soon!</p>
        </BS.Panel>
        <BS.Panel>
          <Link to={'/tasks'}><h2>Tasks</h2></Link>
          <p>High-level metrics coming soon!</p>
        </BS.Panel>
        <BS.Panel>
          <Link to={'/Volunteers'}><h2>Volunteers</h2></Link>
          <p>High-level metrics coming soon!</p>
        </BS.Panel>
      </BS.Col>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  isUserLoaded: user.selectors.isLoaded(state),
  user: user.selectors.state(state),
  causes: causes.selectors.list(state),
  tasks: tasks.selectors.list(state),
  userId: auth.selectors.userId(state),
});

const mapDispatchToProps = ({
  loadUser: user.load
});

export const Dashboard = connect(mapStateToProps, mapDispatchToProps)(DashboardComponent);
