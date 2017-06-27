import React from "react";
import PropTypes from 'prop-types';

const hamburger = (props) =>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill={props.fill}>
    <path d="M32 96h448v96H32zm0 128h448v96H32zm0 128h448v96H32z" />
  </svg>;

hamburger.defaultProps = {
  fill: "#222"
}

hamburger.PropTypes = {
  fill: PropTypes.string
}

export default hamburger;
