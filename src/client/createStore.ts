import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';

// Middlewares and enhancers
import * as logger from './redux/logger';
import * as persist from './redux/persist';

// Reducers
import { AppState, auth, causes, storage, tasks, user } from './modules';

const middleware = applyMiddleware(thunk, logger.middleware);

const setupStore = () => {
  const rootReducer = combineReducers<AppState>({
    [auth.KEY]: auth.reducer,
    [causes.KEY]: causes.reducer,
    [storage.KEY]: storage.reducer,
    [tasks.KEY]: tasks.reducer,
    [user.KEY]: user.reducer,
    form: formReducer,
  });

  const store = createStore<AppState>(
    rootReducer,
    undefined,
    compose(
      persist.storeEnhancer,
      middleware,
    )
  );

  persist.loadStore(store);
  return store;
};

export default setupStore;
