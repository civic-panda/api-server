import * as React from 'react';
import * as BS from 'react-bootstrap';
import { connect } from 'react-redux';

import { AppState, storage } from '../../modules';

import { NavBar } from '../ui';

interface Props {
  children: any;
  isLoaded: boolean;
}

const PageWrapperComponent = (props: Props) =>  (
  <div>
    <NavBar />
    <div className="container" style={{ paddingBottom: '140px' }}>
      <BS.Row>
        {props.isLoaded ? props.children : 'loading...'}
      </BS.Row>
    </div>
  </div>
);

const mapStateToProps = (state: AppState) => ({
  isLoaded: storage.selectors.isLoaded(state),
})

export const PageWrapper = connect(mapStateToProps)(PageWrapperComponent);
