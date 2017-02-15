import { createSelector } from 'reselect';

export * from './actions';

import storeKey from '../../storeKey';
import { AppState } from '../index';
import { LOG_OUT } from '../auth';
import * as lists from '../listHelpers';

export interface Task {
  id: string;
  name: string;
  causeId: string;
  image: string;
  tags: string;
  summary: string;
  location: string;
  duration: string;
  startDate: string;
  endDate: string;
  template: string;
  templateProps: {
    [x: string]: any
  };
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface State {
  list: Task[];
  loaded: boolean;
};

const initialState: Partial<State> = {
  list: [],
  loaded: false,
};

export const KEY = 'tasks';
export const SET = `${storeKey}/${KEY}/SET`;
export const SET_SINGLE = `${storeKey}/${KEY}/SET_SINGLE`;
export const CREATE = `${storeKey}/${KEY}/CREATE`;

const getState = (state: AppState) => state[KEY];
const getList = createSelector(getState, state => state.list);
const find = (state: AppState, key: string, value: any) => createSelector(getList, list => list.find(task => task[key] === value))(state)

export const selectors = {
  state: getState,
  list: getList,
  find,
}

export const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET:
      return { ...state, list: action.payload, loaded: true };
    case SET_SINGLE:
      return {
        ...state,
        list: lists.addOrUpdateItem(state.list, action.payload),
      }
    case CREATE:
      return {
        ...state,
        list: lists.addItem(state.list, action.payload),
      }
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};
