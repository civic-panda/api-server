import * as React from 'react';
import * as BS from 'react-bootstrap';
import * as moment from 'moment';

const getJson = (data: any) => "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));

export const DownloadButton = ({ name, data }: { name: string, data: any }) => (
  <a
    href={`data:${getJson(data)}`}
    download={`${name}_${moment().format('YYYY-MM-DD')}.json`}
  >
    <BS.Button className={'pull-right'}>
      <BS.Glyphicon glyph={'download'} />&nbsp;
      Download {name}
    </BS.Button>
  </a>
);
