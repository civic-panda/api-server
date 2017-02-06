import { createSelector } from 'reselect';

export * from './actions';

import storeKey from '../../storeKey';
import { AppState } from '../index';
import { LOG_OUT } from '../auth';

export interface Cause {
  id: string;
  name: string;
  callToAction: string;
  blurb: string;
  brandColor: string;
  logo: string;
  image: string;
  placeholderImage: string;
  summary: string;
  facts: string;
  reading: string;
  parent: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  role: 'admin' | 'owner' | 'organizer' | 'volunteer';
}

export interface State {
  list: Cause[];
  loaded: boolean;
};

const initialState: Partial<State> = {
  list: [],
  loaded: false,
};

export const KEY = 'causes';
export const SET = `${storeKey}/${KEY}/SET`;
export const SET_SINGLE = `${storeKey}/${KEY}/SET_SINGLE`;

const getState = (state: AppState) => state[KEY];
const getList = createSelector(getState, (state): Cause[] => state.list);
const find = (key: string, value: any) => createSelector(getList, list => list.find((cause: Cause) => cause[key] === value));

export const selectors = {
  state: getState,
  list: getList,
  find,
}

export const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET:
      return { ...state, list: action.payload, loaded: true };
    case SET_SINGLE: {
      const index = state.list.findIndex(cause => cause.id === action.payload.id);
      const front = state.list.slice(0, index);
      const back = state.list.slice(index + 1);
      return {
        ...state,
        list: [...front, action.payload, ...back]
      }
    }
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};
