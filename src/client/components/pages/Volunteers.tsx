import * as React from 'react';
import * as BS from 'react-bootstrap';
import { connect } from 'react-redux';

import { AppState, volunteers, causes } from '../../modules';
import * as Tables from '../tables';

interface Props {
  causes: causes.Cause[];
  volunteers: volunteers.Volunteer[];
  createTask(): any;
  promote(): any;
}

interface State {
  isModalShowing: boolean;
}

class VolunteersPage extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { isModalShowing: false }
  }

  public render() {
    const { causes, volunteers } = this.props;

    return (
      <BS.Col xs={12}>
        <BS.PageHeader>
          Volunteers
        </BS.PageHeader>
        <Tables.Volunteers
          causes={causes}
          volunteers={volunteers}
          promote={this.props.promote}
        />
      </BS.Col>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    causes: causes.selectors.list(state),
    volunteers: volunteers.selectors.list(state),
  };
};

const mapDispatchToProps = ({
  promote: volunteers.promote
});

export const Volunteers = connect(mapStateToProps, mapDispatchToProps)(VolunteersPage)
