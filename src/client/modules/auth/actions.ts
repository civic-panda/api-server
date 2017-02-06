import { Dispatch } from 'redux';
import { hashHistory } from 'react-router';
import { SubmissionError } from 'redux-form';

import { callApi } from '../../util/api'
import { AppState } from '../index';
import { LOG_OUT, SET } from './index';

export const signUp = (formValues: any) => {
  return async (dispatch: Dispatch<AppState>) => {
    try {
      const payload = await callApi('users', 'POST', formValues);
      dispatch({ type: SET, payload });
    } catch (e) {
      if (e.status === 409) {
        throw new SubmissionError({ _error: 'Account already exists.' });
      } else {
        throw new SubmissionError({ _error: 'Error signing up.' });
      }
    }
  }
}

export const logIn = (formValues: any) => {
  return async (dispatch: Dispatch<AppState>) => {
    try {
      const payload = await callApi('tokens', 'POST', formValues);
      dispatch({ type: SET, payload });
    } catch (e) {
      if (e.status === 404) {
        throw new SubmissionError({ _error: 'Account not found.' });
      } else if (e.status === 400) {
        throw new SubmissionError({ _error: 'Incorrect email or password.' });
      } else {
        throw new SubmissionError({ _error: 'Error logging in.' });
      }
    }
  }
}

export const logOut = () => {
  hashHistory.replace('/');
  return { type: LOG_OUT };
}
