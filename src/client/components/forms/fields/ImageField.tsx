// Borrowed heavily from KeystoneJS
import * as React from 'react';
import * as BS from 'react-bootstrap';

import { createUrl, uploadUrl, uploadPreset } from '../../../util/cloudinaryUrl';
import { Props, wrapField } from './wrapField';

interface CloudinaryResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  url: string;
  secure_url: string;
}

interface FileReaderEventTarget extends EventTarget {
  result: string
}

interface FileReaderEvent extends ProgressEvent {
  target: FileReaderEventTarget;
  getMessage(): string;
}

interface State {
  error: string;
  loading: boolean;
  dataUri: string;
  removeExisting: boolean;
  uploadFieldPath: string;
  userSelectedFile: string;
}

interface ImageProps extends Props {
  input: any;
}

const SUPPORTED_REGEX = new RegExp(/^image\/|application\/pdf|application\/postscript/g);

class ImagePicker extends React.Component<ImageProps, State> {
  public constructor(props: ImageProps) {
    super(props);
    this.state = {
      error: null,
      loading: false,
      dataUri: null,
      removeExisting: false,
      userSelectedFile: null,
      uploadFieldPath: 'file path',
    }
  }
  private handleFileChange = (event: any) => {
    console.log('FILE', event.target.files[0]);

    if (!(window as any).FileReader) {
      return alert('File reader not supported by browser.');
    }

    const reader = new FileReader();
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.match(SUPPORTED_REGEX)) {
      return alert('Unsupported file type. Supported formats are: GIF, PNG, JPG, BMP, ICO, PDF, TIFF, EPS, PSD, SVG');
    }

    reader.readAsDataURL(file);

    reader.onloadstart = () => {
      this.setState({ loading: true });
    };

    reader.onloadend = async (upload: FileReaderEvent) => {
      this.setState({ dataUri: upload.target.result })

      try {
        const newFile = await fetch(uploadUrl, {
          method: 'POST',
          body: JSON.stringify({ upload_preset: uploadPreset, file: upload.target.result }),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        });
        const result: CloudinaryResult = await newFile.json();
        console.log('new file', newFile);
        this.setState({ dataUri: null, loading: false, error: null });
        const cloudinaryPublicId = result.public_id;
        this.props.input.onChange(cloudinaryPublicId);
      } catch (e) {
        console.warn('image error', e);
        this.setState({ error: 'error uploading image', dataUri: null, loading: false });
      }
    };
  }

  public render() {
    const { input, meta, options, help, ...otherProps } = this.props;
    const { dataUri, loading, error } = this.state;

    let src;
    if (dataUri) {
      src = dataUri;
    } else if (input.value) {
      src = createUrl(input.value, { height: '200', crop: 'fit' })
    }

    return (
      <div>
        {loading && (
          <BS.Alert bsStyle="info">
            'Uploadng file!'
          </BS.Alert>
        )}
        {error && (
          <BS.Alert bsStyle="danger">
            {error}
          </BS.Alert>
        )}
        {src && (
          <BS.Row>
            <BS.Col xs={12}>
              <BS.Image
                src={src}
                alt="picture to upload"
                thumbnail
                style={{ maxHeight: '200px' }}
              />
            </BS.Col>
          </BS.Row>
        )}
        <BS.FormControl
          {...otherProps}
          type={'file'}
          onChange={this.handleFileChange}
        />
      </div>
    )
  }
}

export const ImageField = wrapField(ImagePicker);
