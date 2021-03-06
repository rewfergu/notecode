import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CM from 'codemirror';

import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/keymap/sublime';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/php/php';
import 'codemirror/mode/python/python';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/sass/sass';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/swift/swift';

class CodeMirror extends Component {
  constructor(props) {
    super(props);

    this.codeContainer = null;
    this.modeSelect = null;
    this.selectMode = this.selectMode.bind(this);
  }
  componentDidMount() {
    this.codeContainer = CM.fromTextArea(this.textarea, {
      scrollbarStyle: 'null',
      lineNumbers: true,
      lineWrapping: true,
      keymap: 'sublime',
      theme: 'material',
      // viewportMargin: 10,
      value: this.props.content,
      mode: this.props.mode
    });
    this.codeContainer.setSize('100%', '100%');
    this.codeContainer.on('keyup', () => {
      this.props.updateContent(this.codeContainer.getValue());
    });
    this.modeSelect.value = this.props.mode;
  }
  componentDidUpdate() {
    if (this.props.content !== this.codeContainer.getValue()) {
      this.codeContainer.setValue(this.props.content);
    }
    this.codeContainer.setOption('mode', this.props.mode);
    this.modeSelect.value = this.props.mode;
  }
  selectMode(e) {
    this.codeContainer.setOption('mode', e.target.value);
    this.props.updateMode(e.target.value);
  }
  render() {
    return (
      <div className="note__code">
        <select
          name="type"
          id="modeSelect"
          className="note__modeSelect"
          onChange={this.selectMode}
          ref={select => {
            this.modeSelect = select;
          }}
        >
          <option value="text">text</option>
          <option value="css">css</option>
          <option value="javascript">javascript</option>
          <option value="jsx">jsx</option>
          <option value="markdown">markdown</option>
          <option value="php">php</option>
          <option value="python">python</option>
          <option value="sass">sass</option>
          <option value="shell">shell</option>
          <option value="sql">sql</option>
        </select>
        <textarea
          id="codemirror"
          value={this.props.content}
          readOnly
          ref={textarea => {
            this.textarea = textarea;
          }}
        />
      </div>
    );
  }
}
CodeMirror.defaultProps = {
  content: '',
  mode: 'text',
  updateContent: null,
  updateMode: null
};
CodeMirror.propTypes = {
  content: PropTypes.string,
  mode: PropTypes.string,
  updateContent: PropTypes.func,
  updateMode: PropTypes.func
};

export default CodeMirror;
