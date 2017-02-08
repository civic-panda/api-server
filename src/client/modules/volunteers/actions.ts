import { Dispatch } from 'redux';
import { SubmissionError } from 'redux-form';

import { callApi } from '../../util/api'
import { AppState } from '../index';
import { PROMOTE } from './index';

export const promote = ({ userId, causeId, roleId, role }:{ userId: string, causeId: string, roleId?: string, role?: string }) => {
  return async (dispatch: Dispatch<AppState>, getState: any) => {
    try {
      const body = { userId, causeId, roleId, role };
      const payload = await callApi('roles', 'POST', body, getState);
      dispatch({ type: PROMOTE, payload });
    } catch (e) {
      throw new SubmissionError({ _error: 'Error promoting user.' });
    }
  }
}
