import { Dispatch } from 'redux';
import { SubmissionError } from 'redux-form';

import { callAuthenticatedApi } from '../../util/api'
import { AppState } from '../index';
import { SET_MULTIPLE } from './index';

export const promote = ({ userId, causeId, roleName }:{ userId: string, causeId: string, roleName: string }) => {
  return async (dispatch: Dispatch<AppState>, getState: any) => {
    try {
      const body = { userId, causeId, roleName };
      const payload = await callAuthenticatedApi(dispatch, getState, 'roles', 'POST', body);
      dispatch({ type: SET_MULTIPLE, payload });
    } catch (e) {
      throw new SubmissionError({ _error: 'Error promoting user.' });
    }
  }
}
