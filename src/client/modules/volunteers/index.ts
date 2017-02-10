export * from './actions';

import { createSelector } from 'reselect';

import storeKey from '../../storeKey';
import { AppState } from '../index';
import { LOG_OUT } from '../auth';
import * as lists from '../listHelpers';

export interface Volunteer {
  id: string;
  userId: string;
  name: string;
  email: string;
  roleName: 'admin' | 'owner' | 'organizer' | 'volunteer';
  causeId: string;
  createdAt: string;
}

export interface State {
  list: Volunteer[];
  loaded: boolean;
};

const initialState: Partial<State> = {
  list: [],
  loaded: false,
};

export const KEY = 'volunteers';
export const SET = `${storeKey}/${KEY}/SET`;
export const SET_MULTIPLE = `${storeKey}/${KEY}/PROMOTE`;
export const SET_SINGLE = `${storeKey}/${KEY}/SET_SINGLE`;
export const CREATE = `${storeKey}/${KEY}/CREATE`;

const getState = (state: AppState) => state[KEY];
const getList = createSelector(getState, state => state.list);

export const selectors = {
  state: getState,
  list: getList,
}

export const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET:
      return {
        ...state,
        list: action.payload,
        loaded: true,
      };
    case SET_SINGLE:
    case SET_MULTIPLE:
     return {
       ...state,
       list: lists.updateItems(state.list, action.payload),
     }
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};
