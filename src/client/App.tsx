import * as React from 'react';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';

import createStore from './createStore';
import routes from './routes';

const store = createStore();

const AppRoot = () => (
  <Provider store={store}>
    <Router history={hashHistory} routes={routes(store)} />
  </Provider>
);

export default AppRoot;
