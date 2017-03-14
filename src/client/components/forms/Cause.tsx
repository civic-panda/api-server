import * as React from 'react';
import { connect } from 'react-redux';
import * as Forms from 'redux-form';
import * as BS from 'react-bootstrap';

import { scrollToTop } from '../../util/scrollToTop';
import { AppState, causes } from '../../modules';
import { BasicField, HtmlField, ImageField } from './fields';

interface OwnProps {
  cause: causes.Cause;
  setOnLeaveHook(isDirty: () => boolean): void;
}

class Cause extends React.Component<any, {}>{
  public componentDidMount() {
    this.props.setOnLeaveHook(() => !this.props.pristine);
  }

  private handleSubmit = () => {
    scrollToTop();
    this.props.handleSubmit();
  }

  public render() {
    return (
      <form>
        <BS.Collapse in={!!this.props.error}>
          <BS.Alert bsStyle="danger">{this.props.error}</BS.Alert>
        </BS.Collapse>
        <BS.Collapse in={!!this.props.submitSucceeded}>
          <BS.Alert bsStyle="success">Saved Successfully!</BS.Alert>
        </BS.Collapse>
        <Forms.Field
          name={'name'}
          label={'Name'}
          type={'text'}
          component={BasicField}
        />
        <Forms.Field
          name={'callToAction'}
          label={'Call To Action (cause landing page headline)'}
          component={BasicField}
        />
        <Forms.Field
          name={'blurb'}
          label={'Blurb (1-2 sentences describing cause)'}
          component={BasicField}
        />
        <Forms.Field
          name={'logoImage'}
          label={'Logo (used in navbar)'}
          component={ImageField}
        />
        <Forms.Field
          name={'heroImage'}
          label={'Hero Image (At top of cause landing page)'}
          component={ImageField}
        />
        <Forms.Field
          name={'placeholderImage'}
          label={'Default Task Image (overridden if task has it\'s own image)'}
          component={ImageField}
        />
        <Forms.Field
          name={'summary'}
          label={'Summary (on cause landing page)'}
          component={HtmlField}
        />
        <Forms.Field
          name={'facts'}
          label={'Key Facts (on cause landing page)'}
          component={HtmlField}
        />
        <Forms.Field
          name={'reading'}
          label={'Further Reading (on cause landing page)'}
          component={HtmlField}
        />
        <br />
        <BS.ButtonToolbar>
          <BS.Button
            onClick={this.handleSubmit}
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
  initialValues: {
    name: ownProps.cause.name,
    callToAction: ownProps.cause.callToAction,
    logoImage: ownProps.cause.logoImage,
    heroImage: ownProps.cause.heroImage,
    placeholderImage: ownProps.cause.placeholderImage,
    blurb: ownProps.cause.blurb,
    summary: ownProps.cause.summary,
    facts: ownProps.cause.facts,
    reading: ownProps.cause.reading,
  },
});

const mapDispatchToProps = (dispatch: any, ownProps: OwnProps) => ({
  onSubmit: (formValues: any) => dispatch(causes.update(ownProps.cause)(formValues))
});

const CauseForm = Forms.reduxForm({ form: 'cause' })(Cause);
export default connect(mapStateToProps, mapDispatchToProps)(CauseForm);
