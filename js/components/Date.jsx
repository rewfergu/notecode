import React from 'react';
import PropTypes from 'prop-types';

const DateDisplay = (props) => {
  let dateFormat = '';
  if (props.lastSaved) {
    dateFormat = new Date(props.lastSaved).toDateString();
  }
  return (
    <p className="note__date">
      { dateFormat }
    </p>
    );
}

DateDisplay.defaultProps = {
  lastSaved: ''
}

DateDisplay.propTypes = {
  lastSaved: PropTypes.string
}

export default DateDisplay;