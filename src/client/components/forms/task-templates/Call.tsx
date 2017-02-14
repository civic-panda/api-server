import * as React from 'react';
import * as Forms from 'redux-form';

import { HtmlField, BasicField } from '../fields';
import { CallListBuilder } from '../sections';

interface Props {
  requestedAction: string;
  petitionScript: string;
  thankYouScript: string;
  callList: any;
}

export const Call = (props: Props) => (
  <Forms.FormSection name={'templateProps'}>
    <Forms.Field
      name={'requestedAction'}
      label={'Requsted Action (Has Name _____?)'}
      type={'text'}
      placeholder={'e.g. done xzy, supported xyz, voted for xyz'}
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
    <CallListBuilder {...props.callList} />
  </Forms.FormSection>
);