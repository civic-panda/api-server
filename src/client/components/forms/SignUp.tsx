import * as React from 'react';
import { connect } from 'react-redux';
import * as Forms from 'redux-form';
import * as BS from 'react-bootstrap';

import { signUp } from '../../modules/auth';
import { BasicField } from './fields';

class SignUp extends React.Component<any, any>{
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
          name={'email'}
          label={'Email'}
          type={'text'}
          component={BasicField}
        />
        <Forms.Field
          name={'password'}
          label={'Password'}
          type={'password'}
          component={BasicField}
        />
        <BS.Button
          onClick={this.props.handleSubmit}
          disabled={this.props.submitting}
          type={'submit'}
          block
        >
          Sign Up
        </BS.Button>
      </form>
    );
  }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = { onSubmit: signUp };

const SignUpForm =  Forms.reduxForm({ form: 'signUp' })(SignUp);
export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
