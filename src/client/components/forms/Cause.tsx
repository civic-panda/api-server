import * as React from 'react';
import { connect } from 'react-redux';
import * as Forms from 'redux-form';
import * as BS from 'react-bootstrap';

import { AppState, causes } from '../../modules';
import { BasicField, HtmlField } from './fields';

interface OwnProps {
  cause: causes.Cause;
}

class Cause extends React.Component<any, {}>{
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
          name={'callToAction'}
          label={'Call To Action'}
          component={HtmlField}
        />
        <Forms.Field
          name={'blurb'}
          label={'Blurb'}
          component={HtmlField}
        />
        <Forms.Field
          name={'summary'}
          label={'Summary'}
          component={HtmlField}
        />
        <Forms.Field
          name={'facts'}
          label={'Key Facts'}
          component={HtmlField}
        />
        <Forms.Field
          name={'reading'}
          label={'Further Reading'}
          component={HtmlField}
        />
        <br />
        <BS.ButtonToolbar>
          <BS.Button
            onClick={this.props.handleSubmit}
            disabled={this.props.submitting || this.props.pristine}
            bsStyle={'primary'}
            type={'submit'}
          >
            Save Changes
          </BS.Button>
          <BS.Button
            onClick={this.props.reset}
            disabled={this.props.submitting || this.props.pristine}
          >
            Cancel Changes
          </BS.Button>
        </BS.ButtonToolbar>
      </form>
    );
  }
}

const mapStateToProps = (_state: AppState, ownProps: OwnProps) => ({
  initialValues: ownProps.cause,
});

const mapDispatchToProps = (dispatch: any, ownProps: OwnProps) => ({
  onSubmit: (formValues: any) => dispatch(causes.update(ownProps.cause)(formValues))
});

const TaskForm = Forms.reduxForm({ form: 'task' })(Cause);
export default connect(mapStateToProps, mapDispatchToProps)(TaskForm);
