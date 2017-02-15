// Loosley based on keystoneJs implementation

import * as React from 'react';
import * as tinymce from 'tinymce';
import * as Forms from 'redux-form';
import * as BS from 'react-bootstrap';

interface Props extends Forms.WrappedFieldProps<any> {
  label: string;
  path: any;
  height: string;
}

interface State {
  id: string;
  isFocused: boolean;
  wysiwygActive: boolean;
  isCollapsed: boolean;
}

var lastId = 0;

function getId() {
  return 'wysiwyg-html-' + lastId++;
}

// Workaround for #2834 found here https://github.com/tinymce/tinymce/issues/794#issuecomment-203701329
function removeTinyMCEInstance(editor: any) {
  var oldLength = tinymce.editors.length;
  tinymce.remove(editor);
  if (oldLength === tinymce.editors.length) {
    tinymce.editors.remove(editor);
  }
}

export class HtmlField extends React.Component<Props, State>{
  public _currentValue: string;
  public editor: any;

  public constructor(props: Props) {
    super(props);
    this.state = {
      id: getId(),
      isFocused: false,
      wysiwygActive: false,
      isCollapsed: false,
    };
  }

  initWysiwyg = () => {
    var opts = this.getOptions();

    const setup = (editor: any) => {
      this.editor = editor;
      editor.on('change', this.valueChanged);
      editor.on('focus', () => this.focusChanged(true));
      editor.on('blur', () => this.focusChanged(false));
    };

    this._currentValue = this.props.input.value;
    tinymce.init({ ...opts, setup });
    this.setState({ wysiwygActive: true });
  }

  removeWysiwyg = (state: State) => {
    removeTinyMCEInstance(tinymce.get(state.id));
    this.setState({ wysiwygActive: false });
  }

  componentDidUpdate(_prevProps: Props, prevState: State) {
    if (prevState.isCollapsed && !this.state.isCollapsed) {
      this.initWysiwyg();
    }

    if (!this.state.wysiwygActive) {
      this.initWysiwyg();
    }
  }

  componentDidMount() {
    this.initWysiwyg();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.editor && this._currentValue !== nextProps.input.value) {
      this.editor.setContent(nextProps.input.value);
    }
  }

  focusChanged = (focused: boolean) => {
    this.setState({
      isFocused: focused,
    });
  }

  valueChanged = (event: any) => {
    var content;
    if (this.editor) {
      content = this.editor.getContent();
    } else {
      content = event.target.value;
    }

    this._currentValue = content;
    this.props.input.onChange(content);
  }

  getOptions = () => {
    const plugins = ['code', 'link', 'lists', 'wordcount', 'autoresize'];
    const toolbar = 'bold italic | bullist numlist | blockquote outdent indent | removeformat | link | code';

    const opts = {
      selector: '#' + this.state.id,
      toolbar,
      plugins,
      menubar: false,
      autoresize_bottom_margin: 10,
      autoresize_max_height: 500,
    };

    return opts;
  }

  public render() {
    const className = this.state.isFocused ? 'is-focused' : '';
    const { input, label, meta } = this.props;
    const style = {
      height: this.props.height,
    };

    return (
      <BS.FormGroup controlId={input.name} className={className}>
        <BS.ControlLabel>
          {label}
        </BS.ControlLabel>
        <textarea
          id={this.state.id}
          onChange={this.valueChanged}
          className={'wysiwyg'}
          style={style}
          value={this.props.input.value}
        />
        {meta && meta.touched && (
          (meta.warning && <BS.HelpBlock>{meta.warning}</BS.HelpBlock>) ||
          (meta.error && <BS.HelpBlock>{meta.error}</BS.HelpBlock>)
        )}
      </BS.FormGroup>
    );
  }
};