import * as fetch from 'isomorphic-fetch';
import { Dispatch } from 'react-redux';

import { getExpiration } from '../util/jwt';
import { AppState, auth } from '../modules'

type method = 'GET' | 'PUT' | 'POST' | 'DELETE'

export const callAuthenticatedApi = async (dispatch: Dispatch<AppState>, getState: any, resource: string, method: method, body?: any) => {
  const state = getState();
  let token = auth.selectors.token(state);
  const expiresIn = getExpiration(token);

  if (expiresIn <= 0) {
    token = await refreshToken(dispatch, getState);
  }

  const headers = { Authorization: `Bearer ${token}` };
  return await callApi(resource, method, body, headers);
}

export const callApi = async (resource: string, method: method, body?: any, headers?: any) => {
  try {
    const results = await fetch(`/api/${resource}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      }
    });
    if (!results.ok) throw results;
    return await results.json();
  } catch (err) {
    console.warn('api error!', err);
    if (err.status === 401) {
      console.log('should have forced reauthentication');
      alert('authentication error, please log out and back in');
    } else {
      throw err;
    }
  }
}

const refreshToken = async (dispatch: Dispatch<AppState>, getState: any) => {
  const refreshToken = auth.selectors.refreshToken(getState());
  const { token } = await callApi('tokens', 'PUT', { refreshToken });
  dispatch(auth.setToken(token));
  return token;
}
