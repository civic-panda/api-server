import { Dispatch } from 'redux';

import { callApi } from '../../util/api'
import { AppState } from '../index';
import * as user from './index';
import * as causes from '../causes';
import * as tasks from '../tasks';

export const load = (userId: any) => {
  return async (dispatch: Dispatch<AppState>, getState: any) => {
    try {
      const response = await callApi(`users/${userId}`, 'GET', null, getState);
      dispatch({ type: user.SET, payload: response.user });
      dispatch({ type: causes.SET, payload: response.causes });
      dispatch({ type: tasks.SET_ALL, payload: response.tasks });
    } catch (e) {
      console.warn('error fetching user', e);
    }
  }
}
