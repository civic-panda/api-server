import * as React from 'react';
import * as Forms from 'redux-form';

import { BasicField, ListSelect } from '../fields';
import * as NationalCongress from '../../../../congress';

interface Props {
  type: 'national' | 'state',
  filter: 'committee' | 'district' | 'none',
  state?: string;
  committee?: string;
  subcommittee?: string;
  seniority?: boolean
  district?: number | 'user';
  ids?: string[];
}

const nationalCommitteeOptions = NationalCongress.committees.map(committee => ({
  name: committee.name,
  value: committee.thomasId,
}))

const getNationalSubcommitteeOptions = (committeeId: string) => {
  const committee = NationalCongress
    .committees
    .find(committee => committee.thomasId === committeeId);

  const subcommittees = (committee && committee.subcommittees)
    ? committee
      .subcommittees
      .map(committee => ({
        name: committee.name,
        value: committee.thomasId,
      }))
    : [];

  return [{ name: 'none', value: '' }, ... subcommittees];
}

const mapLegislatorsToOptions = (legislators: NationalCongress.CongressPerson[]) =>
  legislators.map(legislator => ({
    key: legislator.id.thomas,
    name: legislator.name.officialFull,
    value: legislator,
  }))

const getLegislators = (props: Props) => {
  if (props.type === 'national') {
    if (props.filter === 'none') {
      return mapLegislatorsToOptions(NationalCongress.congress);
    } else if (props.filter === 'committee') {
      if (props.committee) {
        return mapLegislatorsToOptions(NationalCongress.getCommitteeMembers(props.committee, props.subcommittee).members);
      }
      return [];
    } else if (props.filter === 'district') {
      return [];
    }
  }

  return [];
}

const states = [
  { name: 'Nationwide', value: 'USA' },
  { name: 'New York', value: 'NY' },
];

export const CallListBuilder = (props: Props) => {
  console.log('props in CallListBuilder component', props);
  const { filter } = props;
  const committees = props.type === 'national'
    ? nationalCommitteeOptions : [];

  return (
    <Forms.FormSection name={'callList'}>
      <Forms.Field
        name={'type'}
        label={'List type'}
        componentClass={'select'}
        component={BasicField}
        options={[
          { name: 'National legislators', value: 'national' },
          { name: 'State legislators', value: 'state', disabled: true },
        ]}
      />
      <Forms.Field
        name={'filter'}
        label={'Filter type'}
        componentClass={'select'}
        component={BasicField}
        options={[
          { name: 'By committee', value: 'committee' },
          { name: 'By user\'s district', value: 'district' },
        ]}
      />
      {filter === 'committee' &&
        <Forms.Field
          name={'committee'}
          label={'Committee'}
          componentClass={'select'}
          component={BasicField}
          options={committees}
        />
      }
      {filter === 'committee' &&
        <Forms.Field
          name={'subcommittee'}
          label={'Subcommittee'}
          componentClass={'select'}
          component={BasicField}
          options={getNationalSubcommitteeOptions(props.committee)}
        />
      }
      {false && filter === 'district' &&
        <Forms.Field
          name={'state'}
          label={'State'}
          componentClass={'select'}
          component={BasicField}
          options={states}
        />
      }
      {filter === 'committee' &&
        <Forms.FieldArray
          name={'list'}
          label={'Call List'}
          component={ListSelect}
          items={getLegislators(props)}
        />
      }
    </Forms.FormSection>
  )
}
