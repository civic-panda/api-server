import * as React from 'react';
import * as BS from 'react-bootstrap';

import { Column, Row } from './Columns';

interface Props {
  columns: Column<any>[];
  rows: Row[];
  initialSort?: string;
  initialDirection?: 'ascending' | 'descending';
  onClick?(row: Row): any;
}

interface State {
  sortBy: number;
  sortDirection: 'ascending' | 'descending';
}

const nullFn = ():void => null;
const defaultSort = (row: Row) => row.id;

export class Table extends React.Component<Props, State>{
  public constructor(props: Props) {
    super(props);
    this.state = {
      sortDirection: props.initialDirection || 'descending',
      sortBy: props.initialSort
        ? props.columns.findIndex(column => column.key === props.initialSort)
        : 0,
    }
  }

  private reverseSort = () => {
    const currentSort = this.state.sortDirection;
    const reversedSort = currentSort === 'ascending' ? 'descending' : 'ascending';

    this.setState({ sortDirection: reversedSort });
  }

  private changeSort = (index: number) => {
    if (index === this.state.sortBy) this.reverseSort();
    this.setState({ sortBy: index })
  }

  private getHiddenClasses = (column: Column<any>) => column.hiddenAt ? column.hiddenAt.map(size => `hidden-${size}`).join(' ') : ''

  private sortFn = (sortAs: (r: Row) => any = defaultSort) =>(a: Row, b: Row) => {
    const first = this.state.sortDirection === 'ascending' ? a : b;
    const last = this.state.sortDirection === 'ascending' ? b : a;

    if (sortAs(first) < sortAs(last)) {
      return -1;
    } else if (sortAs(first) > sortAs(last)) {
      return 1;
    } else {
      return a.id > b.id ? 0 : 1;
    }
  }

  public render() {
    const { columns, rows, onClick } = this.props;
    const { sortBy, sortDirection } = this.state;
    const sortFn = this.sortFn(columns[sortBy].sortAs);

    return (
      <BS.Table style={{ position: 'relative' }} bordered striped hover>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={column.key} onClick={() => this.changeSort(index)} className={`${column.className} ${this.getHiddenClasses(column)}`}>
                {index === sortBy ? <strong>{column.name}{sortDirection === 'ascending' ? '▲' : '▼'}</strong> : column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.sort(sortFn).map(row => (
            <tr key={row.id} onClick={() => onClick ? onClick(row) : nullFn()}>
              {columns.map(column => (
                <td key={column.key + row.id} className={`${column.className} ${this.getHiddenClasses(column)}`}>
                  {column.renderAs ? column.renderAs(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {rows.length === 0 && (
          <tbody>
            <tr>
              <td style={{
                border: 'solid 1px silver',
                padding: '2em',
                textAlign: 'center',
                position: 'absolute',
                width: '100%',
              }}>
                No Rows
              </td>
            </tr>
          </tbody>
        )}
      </BS.Table>
    );
  }
}
