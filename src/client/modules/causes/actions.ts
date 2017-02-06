import { Dispatch } from 'redux';
import { SubmissionError } from 'redux-form';

import { callApi } from '../../util/api'
import { AppState } from '../index';
import { SET_SINGLE, Cause } from './index';

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
