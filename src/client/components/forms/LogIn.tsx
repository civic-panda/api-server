import * as React from 'react';
import { connect } from 'react-redux';
import * as Forms from 'redux-form';
import * as BS from 'react-bootstrap';

import { auth } from '../../modules';
import { BasicField } from './fields';

class LogIn extends React.Component<any, any>{
  public render() {
    return (
      <form>
        <BS.Collapse in={!!this.props.error}>
          <BS.Alert bsStyle="danger">{this.props.error}</BS.Alert>
        </BS.Collapse>
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
          bsStyle={'primary'}
          type={'submit'}
          block
        >
          Log In
        </BS.Button>
      </form>
    );
  }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = { onSubmit: auth.logIn };

const LogInForm =  Forms.reduxForm({ form: 'logIn' })(LogIn);
export default connect(mapStateToProps, mapDispatchToProps)(LogInForm);
