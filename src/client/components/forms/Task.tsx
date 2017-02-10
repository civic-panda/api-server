import * as React from 'react';
import { connect } from 'react-redux';
import * as Forms from 'redux-form';
import * as BS from 'react-bootstrap';

import { scrollToTop } from '../../util/scrollToTop';
import { AppState, tasks } from '../../modules';
import { BasicField, DateField, HtmlField, ImageField } from './fields';
import * as Templates from './task-templates';

interface OwnProps {
  task: tasks.Task;
  setOnLeaveHook(isDirty: () => boolean): void;
}

const NullComponent = () => (<div>None</div>);

class Task extends React.Component<any, {}>{
  public componentDidMount() {
    this.props.setOnLeaveHook(() => !this.props.pristine);
  }

  private handleSubmit = () => {
    scrollToTop();
    this.props.handleSubmit();
  }

  public render() {
    const Template = Templates[this.props.templateType] || NullComponent;

    return (
      <form>
        <BS.Collapse in={!!this.props.error}>
          <BS.Alert bsStyle="danger">{this.props.error}</BS.Alert>
        </BS.Collapse>
        <BS.Collapse in={!!this.props.submitSucceeded}>
          <BS.Alert bsStyle="success">Saved Successfully!</BS.Alert>
        </BS.Collapse>
        <BS.Panel header={(<h3>Overview</h3>)}>
          <Forms.Field
            name={'name'}
            label={'Name'}
            type={'text'}
            component={BasicField}
          />
          <Forms.Field
            name={'summary'}
            label={'Summary'}
            component={HtmlField}
          />
          <Forms.Field
            name={'image'}
            label={'Image'}
            component={ImageField}
          />
        </BS.Panel>
        <BS.Panel header={(<h3>Time & Place</h3>)}>
          <Forms.Field
            name={'startDate'}
            label={'Start Date'}
            component={DateField}
          />
          <Forms.Field
            name={'endDate'}
            label={'End Date'}
            component={DateField}
          />
          <Forms.Field
            name={'duration'}
            label={'Duration'}
            componentClass={'select'}
            component={BasicField}
            options={[
              { name: '30 minutes', value: '30 minutes' },
              { name: 'One hour', value: 'one hour' },
              { name: 'Half day', value: 'half day' },
              { name: 'Full day', value: 'full day' },
            ]}
          />
        </BS.Panel>
        <BS.Panel header={(<h3>Details</h3>)}>
          <Forms.Field
            name={'template'}
            label={'Task type'}
            componentClass={'select'}
            component={BasicField}
            options={[
              { name: 'Custom', value: 'Custom' },
              { name: 'Call Your Congressmen and Congresswomen', value: 'CallCongress' },
            ]}
          />
          <Template />
        </BS.Panel>
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

const templateTypeSelector = Forms.formValueSelector('task')

const mapStateToProps = (state: AppState, ownProps: OwnProps) => ({
  templateType: templateTypeSelector(state, 'template'),
  initialValues: {
    template: 'Custom',
    ...ownProps.task,
  }
});

const mapDispatchToProps = (dispatch: any, ownProps: OwnProps) => ({
  onSubmit: (formValues: any) => dispatch(tasks.update(ownProps.task)(formValues))
});

const TaskForm = Forms.reduxForm({ form: 'task' })(Task);
export default connect(mapStateToProps, mapDispatchToProps)(TaskForm);
