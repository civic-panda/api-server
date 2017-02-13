import { Dispatch } from 'redux';
import { SubmissionError } from 'redux-form';
import { hashHistory } from 'react-router';

import { callAuthenticatedApi } from '../../util/api'
import { AppState } from '../index';
import { SET_SINGLE, CREATE, Task } from './index';

export const create = (formValues: any) => {
  return async (dispatch: Dispatch<AppState>, getState: any) => {
    try {
      const payload = await callAuthenticatedApi(dispatch, getState, `tasks`, 'POST', formValues);
      dispatch({ type: CREATE, payload });
      hashHistory.push(`/tasks/${payload.id}`);
    } catch (e) {
      throw new SubmissionError({ _error: 'Error creating task.' });
    }
  }
}

export const update = (task: Task) => (formValues: any) => {
  return async (dispatch: Dispatch<AppState>, getState: any) => {
    try {
      const payload = await callAuthenticatedApi(dispatch, getState, `tasks/${task.id}`, 'PUT', formValues);
      dispatch({ type: SET_SINGLE, payload });
    } catch (e) {
      throw new SubmissionError({ _error: 'Error saving task.' });
    }
  }
}
