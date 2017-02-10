// import * as React from 'react';
// import * as moment from 'moment';
import * as BS from 'react-bootstrap';
// import { Link } from 'react-router';

export interface Row {
  id: string;
  [x: string]: any;
}

export interface Column<T extends Row> {
  key: string;
  name: string;
  width?: string;
  renderAs?(row: T): any;
  sortAs?(row: T): any;
  className?: string;
  hiddenAt?: BS.Sizes[];
}

export type MakeColumn<T extends Row> = (opts: Column<T>, ...args: any[]) => Column<T>;

// const boolean: MakeColumn = (opts) => ({
//   sortAs: (row: Row) => row[opts.key] ? 1 : 0,
//   ...opts,
// })

// const link: MakeColumn = (opts, getLink) => ({
//   renderAs: (row: Row) => (<Link to={getLink(row)}>{opts.renderAs(row)}</Link>),
//   ...opts,
// })

// const date: MakeColumn = (opts) => ({
//   renderAs: (row: Row) => moment(row[opts.key]).format('LL'),
//   sortAs: (row: Row) => moment(row[opts.key]).valueOf(),
//   ...opts,
// })

// export const columns = {
//   boolean,
//   link,
//   date,
// }
