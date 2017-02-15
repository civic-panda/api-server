import * as React from 'react';
import * as BS from 'react-bootstrap';
import * as Forms from 'redux-form';

export interface Props<T> extends Forms.WrappedFieldArrayProps<T> {
  name: string;
  help?: string;
  label?: string;
  options?: { name: string, value: string }[];
  componentClass?: string;
}

function wrapArray<T>(Field: React.StatelessComponent<Props<T>> | React.ComponentClass<Props<T>>) {
  return class WrappedField extends React.Component<Props<T>, any> {
    public focus = () => {/* Do nothing */ }

    public render() {
      const { label, meta, help } = this.props;
      return (
        <BS.FormGroup controlId={label}>
          <BS.ControlLabel>
            {label}
          </BS.ControlLabel>
          <Field {...this.props} />
          {help && <BS.HelpBlock>{help}</BS.HelpBlock>}
          {meta && meta.touched && (
            (meta.warning && <BS.HelpBlock>{meta.warning}</BS.HelpBlock>) ||
            (meta.error && <BS.HelpBlock>{meta.error}</BS.HelpBlock>)
          )}
        </BS.FormGroup>
      );
    }
  }
}

export default wrapArray;
