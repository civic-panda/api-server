import * as _ from 'lodash';

export function convertKeysToCamelCase(o: { [key: string]: any }) {
  const initialValue = Array.isArray(o) ? [] : {};

  if (typeof o === 'string') { return o; }

  return Object.keys(o).reduce((prev, current) => {
    const ccKey = _.camelCase(current);

    if(Array.isArray(o[current])) {
      prev[ccKey] = o[current].map((el: any) => convertKeysToCamelCase(el));
    } else if(typeof o[current] === 'object') {
      prev[ccKey] = convertKeysToCamelCase(o[current]);
    } else {
      prev[ccKey] = o[current];
    }

    return prev;
  }, initialValue);
}