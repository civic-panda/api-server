import * as Redux from 'redux';

export interface Action extends Redux.Action {
  type: string;
  payload: any;
  error?: any;
  meta?: any;
};
