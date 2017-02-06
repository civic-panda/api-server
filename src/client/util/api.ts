import * as fetch from 'isomorphic-fetch';

import { auth } from '../modules'

type method = 'GET' | 'PUT' | 'POST' | 'DELETE'

export const callApi = async (resource: string, method: method, body?: any, getState?: any) => {
  try {
    const Authorization = getState ? `Bearer ${auth.selectors.token(getState())}` : undefined;
    const results = await fetch(`/api/${resource}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization,
      }
    });
    if (!results.ok) throw results;
    return await results.json();
  } catch (err) {
    console.warn('api error!', err);
    if (err.status === 401) {
      console.log('should have forced reauthentication');
    } else {
      throw err;
    }
  }
}
