import * as React from 'react';
import * as BS from 'react-bootstrap';
import { connect } from 'react-redux';

import { AppState, user, causes } from '../../modules';
import * as Tables from '../tables';

interface Props {
  causes: causes.Cause[];
}

const CausesPage = ({ causes }: Props) => (
  <BS.Col xs={12}>
    <BS.PageHeader>
      Causes
    </BS.PageHeader>
    <Tables.Causes causes={causes} />
  </BS.Col>
);

const mapStateToProps = (state: AppState) => ({
  causes: causes.selectors.list(state),
});

const mapDispatchToProps = ({
  loadUser: user.load
});

export const Causes = connect(mapStateToProps, mapDispatchToProps)(CausesPage)
