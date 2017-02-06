import * as React from 'react';
import * as BS from 'react-bootstrap';

import wrapField, { Props } from './wrapField';

const RenderField = (props: Props) => {
  const { input, meta, options, ...otherProps } = props;

  return (
    <BS.FormControl
      {...input}
      {...otherProps}
    >
      {options && options.map(option => (<option key={option.name} value={option.value}>{option.name}</option>))}
    </BS.FormControl>
  )
};

export const BasicField = wrapField(RenderField);
