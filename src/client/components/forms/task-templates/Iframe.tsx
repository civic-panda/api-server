import * as React from 'react';
import * as Forms from 'redux-form';

import { BasicField } from '../fields';

export class Iframe extends React.Component<{}, {}>{
  public render() {
    return (
      <Forms.FormSection name={'templateProps'}>
        <Forms.Field
          name={'embedUrl'}
          label={'Url to embed in an iFrame'}
          type={'text'}
          placeholder={'e.g. https://docs.google.com/forms/d/e/1FAIpQL/viewform?embedded=true'}
          component={BasicField}
        />
      </Forms.FormSection>
    );
  }
}
