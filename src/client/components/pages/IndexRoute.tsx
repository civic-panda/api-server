import * as React from 'react';
import { connect } from 'react-redux';

import { AppState, auth } from '../../modules';
import { Auth } from './Auth';
import { Dashboard } from './Dashboard';

interface Props {
  isLoggedIn: boolean;
}

const IndexRouteComponent = ({ isLoggedIn, ...otherProps }: Props) => isLoggedIn
  ? (<Dashboard {...otherProps} />)
  : (<Auth {...otherProps} />);

const mapStateToProps = (state: AppState) => ({
  isLoggedIn: auth.selectors.isLoggedIn(state),
});

export const IndexRoute = connect(mapStateToProps)(IndexRouteComponent);
