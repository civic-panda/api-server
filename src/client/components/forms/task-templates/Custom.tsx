import * as React from 'react';
import * as Forms from 'redux-form';
import * as BS from 'react-bootstrap';

import { HtmlField } from '../fields';

interface Props {
}

interface State {
  numberOfSteps: number;
}

const RenderSteps = ({ fields, meta: { error } }: Forms.WrappedFieldArrayProps<any>) => (
  <BS.FormGroup>
    {fields.map((step, index) =>
      <div key={index}>
        <BS.Button className={'pull-right'} onClick={() => fields.remove(index)} bsSize={'xs'} bsStyle={'danger'}>
          Remove Step <strong>×</strong>
        </BS.Button>
        <Forms.Field
          name={step}
          component={HtmlField}
          label={`Step #${index + 1}`}
        />
      </div>
    )}
    {error && <div className="error">{error}</div>}
    <div>
      <BS.Button onClick={() => fields.push('')} block>
        Add Step
      </BS.Button>
    </div>
  </BS.FormGroup>
)

export class Custom extends React.Component<Props, State>{
  public constructor(props: Props) {
    super(props);
    this.state = {
      numberOfSteps: 1
    }
  }

  // private addStep = () => this.setState({ numberOfSteps: this.state.numberOfSteps + 1 })

  public render() {
    return (
      <Forms.FormSection name={'templateProps'}>
        <Forms.FieldArray
          name={'steps'}
          component={RenderSteps}
        />
      </Forms.FormSection>
    );
  }
}