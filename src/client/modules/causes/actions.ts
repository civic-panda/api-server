import { Dispatch } from 'redux';
import { SubmissionError } from 'redux-form';

import { callAuthenticatedApi } from '../../util/api'
import { AppState } from '../index';
import { SET_SINGLE, SET_MULTIPLE, Cause } from './index';

export const update = (cause: Cause) => (formValues: any) => {
  return async (dispatch: Dispatch<AppState>, getState: any) => {
    try {
      const payload = await callAuthenticatedApi(dispatch, getState, `causes/${cause.id}`, 'PUT', formValues);
      dispatch({ type: SET_SINGLE, payload });
    } catch (e) {
      throw new SubmissionError({ _error: 'Error saving cause.' });
    }
  }
}

export const volunteer = (formValues: any) => {
  return async (dispatch: Dispatch<AppState>, getState: any) => {
    try {
      const body = {
        causeId: formValues.causeId,
        roleName: 'volunteer',
      }
      const payload = await callAuthenticatedApi(dispatch, getState, 'roles', 'POST', body);
      dispatch({ type: SET_MULTIPLE, payload });
    } catch (e) {
      throw new SubmissionError({ _error: 'Error volunteering for cause.' });
    }
  }
}
