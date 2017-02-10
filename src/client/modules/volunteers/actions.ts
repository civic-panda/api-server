import { Dispatch } from 'redux';
import { SubmissionError } from 'redux-form';

import { callApi } from '../../util/api'
import { AppState } from '../index';
import { SET_MULTIPLE } from './index';

export const promote = ({ userId, causeId, roleName }:{ userId: string, causeId: string, roleName: string }) => {
  return async (dispatch: Dispatch<AppState>, getState: any) => {
    try {
      const body = { userId, causeId, roleName };
      const payload = await callApi('roles', 'POST', body, getState);
      dispatch({ type: SET_MULTIPLE, payload });
    } catch (e) {
      throw new SubmissionError({ _error: 'Error promoting user.' });
    }
  }
}
