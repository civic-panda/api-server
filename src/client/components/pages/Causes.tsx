import * as React from 'react';
import * as BS from 'react-bootstrap';
import { connect } from 'react-redux';

import { AppState, user, causes } from '../../modules';
import JoinCause from '../forms/JoinCause';
import * as Tables from '../tables';

interface ModalProps {
  isModalShowing: boolean;
  causes: causes.Cause[];
  hideModal(): void;
  handleSubmit(ars: any[]): void;
}

const JoinCauseModal = (props: ModalProps) => (
  <BS.Modal show={props.isModalShowing} onHide={props.hideModal}>
    <BS.Modal.Header closeButton>
      <BS.Modal.Title>Volunteer for a cause</BS.Modal.Title>
    </BS.Modal.Header>
    <BS.Modal.Body>
      <JoinCause
        causes={props.causes}
        onSubmit={props.handleSubmit}
      />
    </BS.Modal.Body>
  </BS.Modal>
)

interface State {
  isModalShowing: boolean;
}

interface Props {
  causes: causes.Cause[];
  unsubscribed: causes.Cause[];
  volunteer(ars: any[]): void;
}

class CausesPage extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { isModalShowing: false }
  }

  private showModal = () => this.setState({ isModalShowing: true })
  private hideModal = () => this.setState({ isModalShowing: false })
  private handleSubmit = (formValues: any) => {
    this.props.volunteer(formValues);
    this.hideModal();
  }

  public render() {
    return (
      <BS.Col xs={12}>
        <JoinCauseModal
          causes={this.props.unsubscribed}
          isModalShowing={this.state.isModalShowing}
          hideModal={this.hideModal}
          handleSubmit={this.handleSubmit}
        />
        <BS.PageHeader>
          Causes
          <BS.Button
            onClick={this.showModal}
            className={'pull-right'}
            bsStyle={'primary'}
          >
            + Join New Cause
          </BS.Button>
        </BS.PageHeader>
        <Tables.Causes causes={this.props.causes} />
      </BS.Col>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  causes: causes.selectors.list(state),
  unsubscribed: causes.selectors.unsubscribed(state),
});

const mapDispatchToProps = ({
  loadUser: user.load,
  volunteer: causes.volunteer,
});

export const Causes = connect(mapStateToProps, mapDispatchToProps)(CausesPage)
