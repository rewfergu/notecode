import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CheckMark from '../svg/checkmark';
import Cross from '../svg/cross';

class Title extends Component {
  constructor(props) {
    super(props);

    this.updateTitle = this.updateTitle.bind(this);
  }

  updateTitle(e) {
    console.log('updating title...', this.titleInput);
    this.props.updateTitle(this.titleInput.value);
    this.setState({
      editTitle: false
    });
    e.preventDefault();
    return false;
  }
  render() {
    return (
      <form className="note__titleForm" onSubmit={ () => false }>
        <input type="text" placeholder="Title" value={ this.props.text } onChange={ this.updateTitle } className="note__titleField" ref={ (input) => this.titleInput = input } />
      </form>
      );
  }
}

Title.defaultProps = {
  text: '',
  noteId: '0',
  updateTitle() {}
}

Title.propTypes = {
  text: PropTypes.string,
  noteId: PropTypes.string,
  updateTitle: PropTypes.func
}

export default Title;