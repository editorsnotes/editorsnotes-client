"use strict";

var React = require('react')

function getExpirationTime(numDays) {
  var now = new Date().getTime()
    , day = 1000 * 60 * 60 * 24

  numDays = numDays || 120;

  return new Date(now + numDays * day);
}

module.exports = React.createClass({
  displayName: 'Login',

  getInitialState: function () {
    return { username: null, password: null }
  },

  handleChange: function (e) {
    var value = e.target.value
      , field = e.target.name

    this.setState({ [field]: value });
  },

  login(username, password) {
    return fetch('/auth-token/', {
      method: 'post',
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ username, password })
    });
  },

  handleSubmit: function (e) {
    e.preventDefault();

    this.login(this.state.username, this.state.password)
      .then(response => {
        return response.json().then(json => {
          if (response.status === 200) {
            return json.token;
          } else {
            throw new Error(JSON.stringify(json));
          }
        });
      })
      .then(token => {
        var cookie = require('cookie-cutter')

        cookie.set('token', '', { expires: new Date(0) });
        cookie.set('token', token, { path: '/', expires: getExpirationTime() });

        return fetch('/me/', {
          headers: {
            Accept: 'application/json',
            Authorization: 'Token ' + token
          }
        })
      })
      .then(response => {
        var querystring = require('querystring')
          , next = querystring.parse(window.location.search).return_to || '/me/'

        return response.text().then(userInfo => {
          localStorage.userInfo = userInfo;
          window.location.href = next;
        });
      })
  },

  render: function () {
    return (
      <div>
        <h3>Sign in</h3>

        <form onSubmit={this.handleSubmit}>
          <label>
            Username
            {' '}
            <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleChange} />
          </label>

          <label>
            Password
            {' '}
            <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange} />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
});
