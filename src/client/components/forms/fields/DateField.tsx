import * as React from 'react';
import * as DatePicker from 'react-datepicker';
import * as moment from 'moment';

import { Props } from './wrapField';
import { BasicField } from './BasicField';


export class DateField extends React.Component<Props, any> {
  private handleDateChange = (date: moment.Moment) => {
    const value: any = date.format('YYYY-MM-DD');
    this.props.input.onChange(value);
  }

  public render() {
    return (
      <DatePicker
        customInput={<BasicField {...this.props} />}
        selected={moment(this.props.input.value)}
        onChange={this.handleDateChange}
      />
    )
  }
}
