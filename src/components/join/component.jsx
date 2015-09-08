"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../shared/translate.jsx')

function createUser({ username, email, password }) {
  return fetch('/users/', {
    method: 'post',
    headers: {
      'Content-type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({ username, email, password })
  });
}

var ValidatedInput = React.createClass({
  displayName: 'ValidatedInput',

  propTypes: {
    field: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    label: React.PropTypes.string,
    errors: React.PropTypes.array,
    onChange: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {type: 'text'}
  },

  render: function () {
    return (
      <div className={'control-group' + (this.props.errors ? ' error' : '')}>
        <label className="control-label">
          <Translate
            text={this.props.label ? this.props.label : this.props.field} />
          <br/>
          <input
            type="text"
            name={this.props.field}
            value={this.props.value}
            onChange={this.props.onChange} />
          {
            this.props.errors === null ? null :
              <div className="help-inline">
                { this.props.errors.map(message =>
                    [<Translate text={message} />, ' '])
                }
              </div>
          }
        </label>
      </div>
    )
  }
})

module.exports = React.createClass({
  displayName: 'Join',

  getInitialState: function () {
    return {
      errors: Immutable.List(),
      user: Immutable.Record({
        username: null,
        email: null,
        password: null,
        confirm: null
      })
    }
  },

  handleChange: function (e) {
    var value = e.target.value
      , field = e.target.name

    this.setState(prev => ({ user: prev.user.set(field, value) }));
  },

  handleSubmit: function (e) {
    e.preventDefault();
    if (this.validates()) {
      createUser(this.state.user.toJS())
        .then(response => {
          if (response.status === 200) {
            window.location.href = '/me'
          } else {
            throw new Error(
              'POST to create user failed with ' + response.status)
          }
        })
    }
  },

  validates: function() {
    var { validateUser } = require('../../helpers/user')
      , errors = validateUser(this.state.user)

    this.setState({ errors });

    return errors.size === 0;
  },

  render: function () {
    const errors = this.state.errors.groupBy(e => e.get('field'))
    function errorsFor(field) {
      return errors.has(field)
        ? errors.get(field).map(o => o.get('message')).toArray()
        : null
    }
    return (
      <div>
        <h3>Create your account</h3>

        <form onSubmit={this.handleSubmit}>
          <ValidatedInput
            field={'username'}
            value={this.state.user.username}
            errors={errorsFor('username')}
            onChange={this.handleChange} />
          <ValidatedInput
            field={'email'}
            value={this.state.user.email}
            errors={errorsFor('email')}
            onChange={this.handleChange} />
          <ValidatedInput
            field={'password'}
            type={'password'}
            value={this.state.user.passsword}
            errors={errorsFor('password')}
            onChange={this.handleChange} />
          <ValidatedInput
            field={'confirm'}
            type={'password'}
            label={'confirm password'}
            value={this.state.user.confirm}
            errors={errorsFor('confirm')}
            onChange={this.handleChange} />
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
});
