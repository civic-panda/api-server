export * from './actions';

import { createSelector } from 'reselect';
import * as _ from 'lodash';

import storeKey from '../../storeKey';
import { AppState } from '../index';
import { LOG_OUT } from '../auth';
import * as lists from '../listHelpers';

export interface Cause {
  id: string;
  name: string;
  callToAction: string;
  blurb: string;
  brandColor: string;
  logoImage: string;
  heroImage: string;
  placeholderImage: string;
  summary: string;
  facts: string;
  reading: string;
  parent: string;
  children: Cause[];
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
export const SET_ROLE = `${storeKey}/${KEY}/SET_ROLE`;

const getState = (state: AppState) => state[KEY];
const getAll = createSelector(getState, (state): Cause[] => state.list);
const getList = createSelector(getState, (state): Cause[] => state.list.filter(cause => cause.role !== null));
const getUnsubscribedList = createSelector(getState, (state): Cause[] => state.list.filter(cause => cause.role === null));
const find = (key: string, value: any) => createSelector(getAll, list => list.find((cause: Cause) => cause[key] === value));
const getGroupedList = createSelector(getList, list => {
  const grouped = _.groupBy(list, (cause) => cause.parent || 'parents');
  console.log('grouped', grouped, list)
  return grouped['parents'] ? grouped['parents'].map((cause): Cause => ({ ...cause, children: grouped[cause.id] })) : [];
})

export const selectors = {
  state: getState,
  list: getList,
  unsubscribed: getUnsubscribedList,
  find,
  getAll,
  getGroupedList,
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
    case SET_ROLE: {
      const { causeId, role } = action.payload;
      return {
        ...state,
        list: lists.updateItem(state.list, { id: causeId, role }),
      }
    }
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};
