export * from './actions';

import storeKey from '../../storeKey';
import { AppState } from '../index';
import { LOG_OUT } from '../auth';

export interface State {
  userId: string;
  name: string;
  email: string;
  loaded: boolean;
};

const initialState: Partial<State> = {
  loaded: false
};

export const KEY = 'user';
export const SET = `${storeKey}/${KEY}/SET`;
export const selectors = {
  state: (state: AppState) => state[KEY],
  isLoaded: (state: AppState) => state[KEY].loaded,
}

export const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET:
      return { ...state, ...action.payload, loaded: true };
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};
