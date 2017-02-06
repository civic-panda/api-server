import { REHYDRATE } from 'redux-persist/constants';
import * as Redux from 'redux';

export interface State { isLoaded: boolean };

const initialState = { isLoaded: false };

export const reducer = (state: Partial<State> = initialState, action: Redux.Action) => {
  switch (action.type) {
    case REHYDRATE:
      return { isLoaded: true };
    default:
      return state;
  }
};

export const KEY = 'storage';
export const selectors = {
  isLoaded: (state: any) => state[KEY].isLoaded,
}
