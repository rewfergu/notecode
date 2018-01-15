import React, { Component } from 'react';
import PropTypes from 'prop-types';
import API from '../API';

class SideBar extends Component {
  constructor(props) {
    super(props);

    this.selectNote = this.selectNote.bind(this);
  }
  selectNote(e) {
    this.props.selectNote(e.target.id);
  }
  toggleMenuGroup(e) {
    e.target.classList.toggle('active');
  }
  render() {
    const menuArray = [];
    // title[0] = _id
    // title[1] = name
    // title[2] = mode
    this.props.titles.forEach(item => {
      let currentMode;

      if (menuArray.length > 0) {
        currentMode = Object.keys(menuArray[menuArray.length - 1])[0];
      }

      if (currentMode && currentMode === item[2]) {
        menuArray[menuArray.length - 1][item[2]].push(item);
      } else {
        const obj = {};
        obj[item[2]] = [item];
        menuArray.push(obj);
      }
    });

    return (
      <aside className={this.props.expanded ? 'sidebar expanded' : 'sidebar'}>
        <ul className="sidebar__noteMenu">
          {menuArray.map(item => {
            const thisKey = Object.keys(item)[0];
            return (
              <li key={thisKey} className="sidebar__groupHeading">
                <button onClick={this.toggleMenuGroup}>
                  {thisKey}
                </button>
                <ul className="sidebar__submenu">
                  {item[thisKey].map(title =>
                    <li key={title[0]} className="sidebar__title">
                      <button id={title[0]} onClick={this.selectNote}>
                        {title[1]}
                      </button>
                    </li>
                  )}
                </ul>
              </li>
            );
          })}
        </ul>
        <button className="sidebar__new" onClick={this.props.createNote}>
          New Note
        </button>
      </aside>
    );
  }
}

SideBar.defaultProps = {
  titles: [],
  expanded: false,
  selectNote() {},
  createNote() {}
};

SideBar.propTypes = {
  titles: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  selectNote: PropTypes.func,
  createNote: PropTypes.func,
  expanded: PropTypes.bool
};

export default SideBar;
