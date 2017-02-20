import * as React from 'react';
import * as BS from 'react-bootstrap';

import { Column, Row } from './Columns';

interface NestedRow extends Row {
  parent?: string;
  children?: NestedRow[];
}

interface Props {
  columns: Column<any>[];
  rows: NestedRow[];
  initialSort?: string;
  initialDirection?: 'ascending' | 'descending';
  onClick?(row: Row): any;
}

interface State {
  sortBy: number;
  sortDirection: 'ascending' | 'descending';
  expanded: {
    [x: string]: boolean;
  }
}

const nullFn = (): void => null;
const defaultSort = (row: NestedRow) => row.id;

export class Nested extends React.Component<Props, State>{
  public constructor(props: Props) {
    super(props);
    this.state = {
      expanded: {},
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

  private toggleExpansion = (row: NestedRow) => {
    this.setState({
      expanded: {
        ...this.state.expanded,
        [row.id]: !this.state.expanded[row.id],
      }
    })
  }

  private renderParentRow = (row: NestedRow) => {
    const { columns, onClick } = this.props;
    const isExpanded = this.state.expanded[row.id];

    return (
      <tr key={row.id} onClick={() => onClick ? onClick(row) : nullFn()}>
        <td key={`expand-${row.id}`}>
          <BS.Button onClick={() => this.toggleExpansion(row)} disabled={!row.children}>
            {isExpanded
              ? (<BS.Glyphicon glyph={'minus-sign'} />)
              : (<BS.Glyphicon glyph={'plus-sign'} />)}
          </BS.Button>
        </td>
        {columns.map(column => (
          <td key={column.key + row.id} className={`${column.className} ${this.getHiddenClasses(column)}`}>
            {column.renderAs ? column.renderAs(row) : row[column.key]}
          </td>
        ))}
      </tr>
    );
  }

  private renderChildRow = (row: NestedRow) => {
    const { columns, onClick } = this.props;

    return (
      <tr key={row.id} onClick={() => onClick ? onClick(row) : nullFn()}>
        <td key={`expand-${row.id}`}>
          <BS.Glyphicon glyph={'child'} />
        </td>
        {columns.map(column => (
          <td key={column.key + row.id} className={`${column.className} ${this.getHiddenClasses(column)}`}>
            {column.renderAs ? column.renderAs(row) : row[column.key]}
          </td>
        ))}
      </tr>
    );
  }

  public render() {
    const { columns, rows } = this.props;
    const { sortBy, sortDirection } = this.state;
    const sortAs = columns[sortBy].sortAs || defaultSort;
    const sortFn = (a: Row, b: Row) => sortDirection === 'ascending' ? (sortAs(a) < sortAs(b) ? -1 : 1) : (sortAs(a) > sortAs(b) ? -1 : 1);

    return (
      <BS.Table style={{ position: 'relative' }} bordered striped hover>
        <thead>
          <tr>
            <th key={'expand'} style={{ width: '40px' }}></th>
            {columns.map((column, index) => (
              <th
                key={column.key}
                onClick={() => this.changeSort(index)}
                className={`${column.className} ${this.getHiddenClasses(column)}`}
                style={{ width: column.width || '' }}
              >
                {index === sortBy ? <strong>{column.name}{sortDirection === 'ascending' ? '▲' : '▼'}</strong> : column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.sort(sortFn).map(row => {
            const isExpanded = this.state.expanded[row.id] === false; // default open if undefined
            const parent = this.renderParentRow(row);
            const children = isExpanded && row.children.sort(sortFn).map(this.renderChildRow);
            return [parent, children];
          })}
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
