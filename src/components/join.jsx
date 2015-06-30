"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Jed = require('jed')
  , Translate = require('./shared/translate.jsx')
  , validator = require('validator')

function createUser(username, email, password) {
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
    i18n: React.PropTypes.instanceOf(Jed).isRequired,
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
            text={this.props.label ? this.props.label : this.props.field}
            i18n={this.props.i18n} />
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
                    [<Translate
                      text={message}
                      i18n={this.props.i18n} />, ' '])
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
    return { username: null
           , email: null
           , password: null
           , confirm: null
           , errors: Immutable.List()
           }
  },

  handleChange: function (e) {
    var value = e.target.value
      , field = e.target.name

    this.setState({ [field]: value });
  },

  handleSubmit: function (e) {
    e.preventDefault();
    if (this.validates()) {
      createUser(this.state.username, this.state.email, this.state.password)
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
    var errors = this.state.errors.clear()
    const validateField = (field, pass, message) =>
    {
      if (pass(this.state[field])) {
        return true
      }
      errors = errors.push(Immutable.Map({field: field, message: message}))
      return false
    }
    if (validateField('username', f => !validator.isNull(f),
                       'username is required')) {
        validateField('username', f => validator.isAscii(f),
                       'username must be ascii')
    }
    validateField('email', f => validator.isEmail(f),
                   'email must be valid')
    validateField('password', f => validator.isLength(f, 8),
                   'password must be at least 8 characters')
    validateField('confirm', f => validator.equals(f, this.state.password),
                   'passwords do not match')
    this.setState({errors: errors})
    return errors.size === 0
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
            i18n={this.props.i18n}
            field={'username'}
            value={this.state.username}
            errors={errorsFor('username')}
            onChange={this.handleChange} />
          <ValidatedInput
            i18n={this.props.i18n}
            field={'email'}
            value={this.state.email}
            errors={errorsFor('email')}
            onChange={this.handleChange} />
          <ValidatedInput
            i18n={this.props.i18n}
            field={'password'}
            type={'password'}
            value={this.state.passsword}
            errors={errorsFor('password')}
            onChange={this.handleChange} />
          <ValidatedInput
            i18n={this.props.i18n}
            field={'confirm'}
            type={'password'}
            label={'confirm password'}
            value={this.state.passsword}
            errors={errorsFor('confirm')}
            onChange={this.handleChange} />
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
});
