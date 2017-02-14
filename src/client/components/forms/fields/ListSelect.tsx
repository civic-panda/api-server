import * as React from 'react';
import * as BS from 'react-bootstrap';
import * as Forms from 'redux-form';

import wrapArray, { Props } from './wrapArray';

interface ListProps<T> extends Props<T> {
  items: { key: string, name: string, value: any }[];
}

const repToString = (rep: any) => {
  const currentTerm = rep.terms[rep.terms.length - 1];
  return `${currentTerm.type === 'rep' ? 'Rep.' : 'Sen.'} ${rep.name.officialFull}, ${currentTerm.party[0]} ${currentTerm.state}`
}

const yeaPopover = (<BS.Popover id="yea-top">Thank this legislator</BS.Popover>);
const unsurePopover = (<BS.Popover id="unsure-top">Unsure of stance</BS.Popover>);
const nayPopover = (<BS.Popover id="nay-top">Petition this legislator</BS.Popover>);

const renderName = (props: Forms.WrappedFieldProps<any>) => (
  <span>
    <span>{repToString(props.input.value)}</span>
    <BS.ButtonGroup className={'pull-right'} bsSize={'small'}>
      <BS.OverlayTrigger trigger={['hover', 'focus']} placement={'top'} overlay={yeaPopover}>
        <BS.Button
          bsStyle={props.input.value.stance === 'yea' ? 'success' : 'default' }
          onClick={() => props.input.onChange({ ...props.input.value, stance: 'yea' })}
        >
          <BS.Glyphicon glyph={'ok-sign'} />
        </BS.Button>
      </BS.OverlayTrigger>
      <BS.OverlayTrigger trigger={['hover', 'focus']} placement={'top'} overlay={unsurePopover}>
        <BS.Button
          bsStyle={props.input.value.stance === undefined ? 'info' : 'default' }
          onClick={() => props.input.onChange({ ...props.input.value, stance: undefined })}
        >
          <BS.Glyphicon glyph={'question-sign'} />
        </BS.Button>
      </BS.OverlayTrigger>
      <BS.OverlayTrigger trigger={['hover', 'focus']} placement={'top'} overlay={nayPopover}>
        <BS.Button
          bsStyle={props.input.value.stance === 'nay' ? 'danger' : 'default' }
          onClick={() => props.input.onChange({ ...props.input.value, stance: 'nay' })}
        >
          <BS.Glyphicon glyph={'remove-sign'} />
        </BS.Button>
      </BS.OverlayTrigger>
    </BS.ButtonGroup>
  </span>
);

function ListComponent<T>(props: ListProps<T>) {
  // const unselected = props.items.filter(item => {
    // props.fields.
  // });
  props.fields.map(item => console.log('item', item));
  return (
    <BS.Row>
      <BS.Col xs={12}>
        <h5>Selected</h5>
        <BS.Well bsSize={'sm'} style={{ maxHeight: '250px', overflow: 'auto' }}>
          {props.fields.map((item: any, index) => (
            <BS.Col key={item}>
              <BS.Button bsSize={'sm'} bsStyle={'danger'} onClick={() => props.fields.remove(index)}>
                <BS.Glyphicon glyph={'minus-sign'} />
              </BS.Button>
              &nbsp;
              <Forms.Field
                name={item}
                component={renderName}
              />
            </BS.Col>
          ))}
        </BS.Well>

        <h5>Not Selected</h5>
        <BS.Well bsSize={'sm'} style={{ maxHeight: '250px', overflow: 'auto' }}>
          {props.items.map(item => (
            <BS.Col key={item.value.id.bioguide}>
              <BS.Button bsSize={'sm'} onClick={() => props.fields.push(item.value)}>
                <BS.Glyphicon glyph={'plus-sign'} />
              </BS.Button>
              &nbsp;
              {repToString(item.value)}, Rank #{item.value.rank}
            </BS.Col>
          ))}
        </BS.Well>
      </BS.Col>
    </BS.Row>
  )
}
      /*{selected.map(item => (
        <BS.Button onClick={() => props.input.onChange([
          ...props.input.value,
          item.value
        ])}>
          {item.name}
        </BS.Button>
      ))}
      {unselected.map(item => (
        <BS.Button onClick={() => props.input.onChange(item.value)}>
          {item.name}
        </BS.Button>
      ))}*/

export const ListSelect = wrapArray(ListComponent);
