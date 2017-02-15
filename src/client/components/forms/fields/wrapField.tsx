import * as React from 'react';
import * as BS from 'react-bootstrap';
import * as Forms from 'redux-form';

export interface Props extends Forms.WrappedFieldProps<any> {
  name: string;
  help?: string;
  label?: string;
  options?: { name: string, value: string, disabled?: boolean }[];
  componentClass?: string;
}

export const wrapField = (Field: React.StatelessComponent<Props> | React.ComponentClass<Props>) => {
  return class WrappedField extends React.Component<Props, any> {
    public focus = () => {/* Do nothing */}

    public render() {
      const { input, label, meta, help } = this.props;
      return (
        <BS.FormGroup controlId={input.name}>
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

export default wrapField;
