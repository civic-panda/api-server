import { Dispatch } from 'redux';

import { callAuthenticatedApi } from '../../util/api'
import { AppState } from '../index';
import * as user from './index';
import * as causes from '../causes';
import * as tasks from '../tasks';
import * as volunteers from '../volunteers';

export const load = (userId: any) => {
  return async (dispatch: Dispatch<AppState>, getState: any) => {
    try {
      const response = await callAuthenticatedApi(dispatch, getState, `users/${userId}`, 'GET');
      dispatch({ type: user.SET, payload: response.user });
      dispatch({ type: causes.SET, payload: response.causes });
      dispatch({ type: tasks.SET, payload: response.tasks });
      dispatch({ type: volunteers.SET, payload: response.volunteers });
    } catch (e) {
      console.warn('error fetching user', e);
    }
  }
}
