import * as React from 'react';
import * as Forms from 'redux-form';

import { HtmlField, BasicField } from '../fields';

export const CallCongress = () => (
  <Forms.FormSection name={'templateProps'}>
    <Forms.Field
      name={'requestedAction'}
      label={'Requsted Action'}
      type={'text'}
      component={BasicField}
    />
    <Forms.Field
      name={'petitionScript'}
      label={'Petition Script'}
      component={HtmlField}
    />
    <Forms.Field
      name={'thankYouScript'}
      label={'Thank You Script'}
      component={HtmlField}
    />
  </Forms.FormSection>
);
