import { Dispatch } from 'redux';
import { SubmissionError } from 'redux-form';

import { callApi } from '../../util/api'
import { AppState } from '../index';
import { SET_SINGLE, SET_ROLE, Cause } from './index';

export const update = (cause: Cause) => (formValues: any) => {
  return async (dispatch: Dispatch<AppState>, getState: any) => {
    try {
      const payload = await callApi(`causes/${cause.id}`, 'PUT', formValues, getState);
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
        role: 'volunteer',
      }
      const payload = await callApi('roles', 'POST', body, getState);
      dispatch({ type: SET_ROLE, payload });
    } catch (e) {
      throw new SubmissionError({ _error: 'Error volunteering for cause.' });
    }
  }
}
