type hasId = {
  id: string;
  [x: string]: any;
}

export const updateItem = <T extends hasId>(list: T[], update: Partial<T>): T[] => {
  const index = list.findIndex(item => item.id === update.id as string);

  if (index === -1) {
    console.warn('could not find list item', list, update);
    return list;
  }

  return [
    ...list.slice(0, index),
    Object.assign({}, list[index], update),
    ...list.slice(index + 1),
  ]
}

export const updateItems = <T extends hasId>(list: T[], updates: Partial<T>[]): T[] => {
  return updates.reduce((prev, update) => updateItem(prev, update), list);
}

export const addItem = <T extends hasId>(list: T[], item: T): T[] => {
  return [ ...list, item ]
}

export const addOrUpdateItem = <T extends hasId>(list: T[], item: T): T[] => {
  const index = list.findIndex(item => item.id === item.id);

  return index === -1 ? addItem(list, item) : updateItem(list, item);
}

export const removeItem = <T extends hasId>(list: T[], update: Partial<T>): T[] => {
  const index = list.findIndex(item => item.id === update.id as string);

  return [
    ...list.slice(0, index),
    ...list.slice(index + 1),
  ]
}