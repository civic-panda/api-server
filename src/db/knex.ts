import * as knex from 'knex';
import * as dbConfig from './knexfile';

type ReturnedRow<Row, ReturnedColumns extends keyof Row> = {
  [K in ReturnedColumns]: Row[K]
}

type SQLMethods<Row, Columns extends keyof Row> = {
    select?: Columns[],
    where?: any,
    column?: any,
    values?: any,
    patch?: any
    insert?: any
}

const currentConfig = dbConfig[process.env.NODE_ENV || 'development'];
export const knexInstance = knex(currentConfig);

export const takeOne = (array: any[]) => array[0];

const removeUndefined = <T>(obj: T): void =>
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'undefined') delete obj[key];
  });

export const create = async <Row, Columns extends keyof Row>(tableName: string, { select, insert }: SQLMethods<Row, Columns>): Promise<ReturnedRow<Row, Columns>> =>
  await knexInstance(tableName)
    .returning(select)
    .insert(insert)
    .then(takeOne)

export const find = async <Row, Columns extends keyof Row>(tableName: string, { select, where }: SQLMethods<Row, Columns>): Promise<ReturnedRow<Row, Columns>[]> => {
  removeUndefined(where);
  return await knexInstance(tableName)
    .select(select)
    .where(where)
};

export const findIn = async <Row, Columns extends keyof Row>(tableName: string, { select, column, values }: SQLMethods<Row, Columns>): Promise<ReturnedRow<Row, Columns>[]> => {
  return await knexInstance(tableName)
    .select(select)
    .whereIn(column, values)
};

export const findOne = async <Row, Columns extends keyof Row>(tableName: string, { select, where }: SQLMethods<Row, Columns>): Promise<ReturnedRow<Row, Columns>> => {
  removeUndefined(where);
  return await knexInstance(tableName)
    .select(select)
    .where(where)
    .then(takeOne)
};

export const destroy = async <Row, Columns extends keyof Row>(tableName: string, { where }: SQLMethods<Row, Columns>): Promise<ReturnedRow<Row, Columns>> =>
  await knexInstance(tableName)
    .where(where)
    .del();

export const update = async <Row, Columns extends keyof Row>(tableName: string, { select, where, patch }: SQLMethods<Row, Columns>): Promise<ReturnedRow<Row, Columns>> =>
  await knexInstance(tableName)
    .returning(select)
    .where(where)
    .update(patch)
    .then(takeOne)

export class Table<TableShape, ReturnedColumns extends keyof TableShape> {
  private name: string;

  constructor(name: string, private columns: ReturnedColumns[] = []){
    this.name = name;
  }

  public create = (insert: Partial<TableShape>) => {
    return create<TableShape, ReturnedColumns>(this.name, { select: this.columns, insert });
  }

  public destroy = (where: Partial<TableShape>) => {
    return destroy<TableShape, ReturnedColumns>(this.name, { where });
  }

  public find = (where: Partial<TableShape>) => {
    return find<TableShape, ReturnedColumns>(this.name, { select: this.columns, where });
  }

  public findIn = (column: string, values: any[]) => {
    return findIn<TableShape, ReturnedColumns>(this.name, { select: this.columns, column, values });
  }

  public findOne = (where: Partial<TableShape>) => {
    return findOne<TableShape, ReturnedColumns>(this.name, { select: this.columns, where });
  }

  public update = (where: Partial<TableShape>, patch: Partial<TableShape>) => {
    return update<TableShape, ReturnedColumns>(this.name, { select: this.columns, where, patch });
  }
}

export default knexInstance;
