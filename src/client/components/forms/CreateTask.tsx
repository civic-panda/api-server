import * as React from 'react';
import * as Forms from 'redux-form';
import * as BS from 'react-bootstrap';

import { causes } from '../../modules';
import { BasicField } from './fields';

class CreateTask extends React.Component<any, {}>{
  public render() {
    return (
      <form>
        <BS.Collapse in={!!this.props.error}>
          <BS.Alert bsStyle="danger">{this.props.error}</BS.Alert>
        </BS.Collapse>
        <Forms.Field
          name={'name'}
          label={'Name'}
          type={'text'}
          component={BasicField}
        />
        <Forms.Field
          name={'causeId'}
          label={'Cause'}
          componentClass={'select'}
          component={BasicField}
          options={this.props.causes.map((cause: causes.Cause) => ({
            name: cause.name,
            value: cause.id,
          }))}
        />
        <br />
        <BS.ButtonToolbar>
          <BS.Button
            onClick={this.props.handleSubmit}
            disabled={this.props.submitting || (this.props.initialValues.name ? false : this.props.pristine)}
            bsStyle={'primary'}
            type={'submit'}
            block
          >
            Save Changes
          </BS.Button>
        </BS.ButtonToolbar>
      </form>
    );
  }
}

const CreateTaskForm = Forms.reduxForm({ form: 'createTask' })(CreateTask);
export default CreateTaskForm;
