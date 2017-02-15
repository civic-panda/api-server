import * as React from 'react';
import * as Forms from 'redux-form';
import * as BS from 'react-bootstrap';

import { causes } from '../../modules';
import { BasicField } from './fields';

class JoinCause extends React.Component<any, {}>{
  public render() {
    const options = [
      { name: 'Select Cause', value: null },
      ...this.props.causes.map((cause: causes.Cause) => ({
        name: cause.name,
        value: cause.id,
      }))
    ]

    return (
      <form>
        <BS.Collapse in={!!this.props.error}>
          <BS.Alert bsStyle="danger">{this.props.error}</BS.Alert>
        </BS.Collapse>
        <Forms.Field
          name={'causeId'}
          label={'Cause'}
          componentClass={'select'}
          component={BasicField}
          placeholder={'Select cause'}
          options={options}
        />
        <br />
        <BS.ButtonToolbar>
          <BS.Button
            onClick={this.props.handleSubmit}
            disabled={this.props.submitting || this.props.pristine}
            bsStyle={'primary'}
            block
          >
            Volunteer
          </BS.Button>
        </BS.ButtonToolbar>
      </form>
    );
  }
}

const JoinCauseForm = Forms.reduxForm({ form: 'joinCause' })(JoinCause);
export default JoinCauseForm;
