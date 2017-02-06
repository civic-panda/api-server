export * from './actions';

import storeKey from '../../storeKey';
import { AppState } from '../index';

export interface State {
  userId: string;
  token: string;
  refreshToken: string;
};

const initialState: Partial<State> = {
  userId: undefined,
  token: undefined,
  refreshToken: undefined,
};

export const KEY = 'auth';
export const SET = `${storeKey}/${KEY}/SET`;
export const LOG_OUT = `${storeKey}/${KEY}/LOG_OUT`;
export const selectors = {
  isLoggedIn: (state: AppState) => !!state[KEY].token,
  userId: (state: AppState) => state[KEY].userId,
  token: (state: AppState) => state[KEY].token,
}

export const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET:
      return { ...state, ...action.payload };
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};
