import * as Redux from 'redux';
import { autoRehydrate, persistStore } from 'redux-persist';

import { AppState } from '../modules';
import KEY from '../storeKey';

const storeConfig = {
  keyPrefix: KEY,
  debounce: 250,
  blacklist: ['form'],
};

export const storeEnhancer = autoRehydrate<AppState>();
export const loadStore = (store: Redux.Store<AppState>) => new Promise((resolve) => {
  persistStore<AppState>(store, storeConfig, resolve);
});
