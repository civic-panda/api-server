import * as React from 'react';
import * as BS from 'react-bootstrap';

import wrapField, { Props } from './wrapField';

const RenderField = (props: Props) => {
  const { componentClass, input, meta, options, ...otherProps } = props;

  if (componentClass === 'select') {
    return (
      <BS.FormControl
        {...input}
        {...otherProps}
        componentClass={componentClass}
      >
        <option
          key={'placeholder'}
          disabled
        >
          ---
        </option>
        {options && options.map(option => (
          <option
            key={option.name}
            value={option.value}
            disabled={option.disabled}
          >
            {option.name}
          </option>
        ))}
      </BS.FormControl>
    );
  }

  return (
    <BS.FormControl
      {...input}
      {...otherProps}
      componentClass={componentClass}
    />
  );
};

export const BasicField = wrapField(RenderField);
