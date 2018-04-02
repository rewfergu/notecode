import React, { Component } from 'react';
import PropTypes from 'prop-types';
import API from '../../server/db';

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
    // menuArray = [
    //   {'css': [{}, {}, {}]}
    // ]

    // title[0] = _id
    // title[1] = name
    // title[2] = mode
    this.props.titles.forEach((item, index, arr) => {
      const currentMode = item[2];
      let copied = false;

      menuArray.forEach((menuItem, menuIndex) => {
        // look up the key for each note group
        // check if its the same as the current mode we are in
        const menuItemMode = Object.keys(menuItem)[0];
        if (menuItemMode === currentMode) {
          menuArray[menuIndex][menuItemMode].push(item);
          copied = true;
        }
      });

      if (!copied) {
        const newMode = {};
        newMode[currentMode] = [item];
        menuArray.push(newMode);
      }
    });

    console.log('menu array', menuArray);

    return (
      <aside className={this.props.expanded ? 'sidebar expanded' : 'sidebar'}>
        <div className="userInfo">
          <div className="userInfo__picture">
            {this.props.picture &&
              <img src={this.props.picture} alt={this.props.userName} />}
          </div>
          <p className="userInfo__username">{this.props.userName}</p>

          <button className="userInfo__logout" onClick={this.props.logout}>
            Logout
          </button>
        </div>
        <ul className="sidebar__noteMenu">
          {menuArray.map((item, i, arr) => {
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
