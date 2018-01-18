import React, { Component } from 'react';
import PropTypes from 'prop-types';
import API from '../API';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.checkLogin = this.checkLogin.bind(this);
  }

  checkLogin() {
    if (this.state.user) {
      console.log('logging out...');
      API.logout();
      return;
    }

    console.log('logging in...');
    API.login();
  }
  componentWillMount() {
    this.setState({
      user: this.props.user
    });
  }
  componentWillReceiveProps() {
    const _this = this;
    if (this.props.user && !this.state.user) {
      console.log('we dont have user state', this.state.user);
      API.getUserInfo().then(data => {
        console.log('get user info', data);
        _this.setState({
          picture: data.data.picture,
          user: this.props.user
        });
      });
    }
  }
  renderUserAction() {
    if (this.state.picture) {
      return (
        <button className="userInfo__picture" onClick={API.logout}>
          <img src={this.state.picture} alt="user" />
        </button>
      );
    }

    return (
      <button className="userInfo__login" onClick={API.login}>Login</button>
    );
  }
  render() {
    return (
      <div className="userInfo">
        {this.renderUserAction()}
      </div>
    );
  }
}

User.defaultProps = {
  picture: '',
  auth() {},
  logout() {}
};

User.propTypes = {
  picture: PropTypes.string,
  auth: PropTypes.func,
  logout: PropTypes.func
};

export default User;
