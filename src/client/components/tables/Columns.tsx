import * as React from 'react';
import * as moment from 'moment';
import { Link } from 'react-router';

export type Row = {
  id: string;
  [x: string]: any;
}

export type Column = {
  key: string;
  name: string;
  renderAs?(row: Row): any;
  sortAs?(row: Row): any;
  className?: string;
  hiddenAt?: ('xs' | 'sm' | 'md' | 'lg')[];
}

export type MakeColumn = (opts: Column, ...args: any[]) => Column;

const boolean: MakeColumn = (opts) => ({
  sortAs: (row: Row) => row[opts.key] ? 1 : 0,
  ...opts,
})

const link: MakeColumn = (opts, getLink) => ({
  renderAs: (row: Row) => (<Link to={getLink(row)}>{opts.renderAs(row)}</Link>),
  ...opts,
})

const date: MakeColumn = (opts) => ({
  renderAs: (row: Row) => moment(row[opts.key]).format('LL'),
  sortAs: (row: Row) => moment(row[opts.key]).valueOf(),
  ...opts,
})

export const columns = {
  boolean,
  link,
  date,
}
