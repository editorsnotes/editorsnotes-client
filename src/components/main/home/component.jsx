"use strict";

var React = require('react')
  , UserHomepage
  , NonUserHomepage

UserHomepage = React.createClass({
  render: function () {
    var { user } = this.props

    return (
      <div className="row">
        <div className="span6">
          <a href="/auth/account/">Account settings</a>

          <hr />

          <div>
            { user.get('project_roles').map((role, i) =>
                <div key={i}>
                  { role.get('project') }
                  <ul>
                    <li>
                      <a href={ role.get('project_url') + 'notes/add/' }>
                      Add note
                      </a>
                    </li>
                  </ul>
                </div>
              )
            }
          </div>
        </div>
        <div className="span6">
          <pre>
          { JSON.stringify(this.props.user, true, '  ') }
          </pre>
        </div>
      </div>
    )
  }
});


NonUserHomepage = React.createClass({
  render() {
    var { data } = this.props

    return (
      <div>
        <h1>Working Notes</h1>
        <p className="large">
          Working Notes is an <a href="http://github.com/editorsnotes">open-source</a>, web-based tool for recording, organizing, preserving, and opening access to research notes, built with the needs of documentary editing projects, archives, and library special collections in mind.
        </p>

        <h2>Sign up</h2>
        <p><a href="/auth/account/create">Create an account</a></p>

        <h2>Recently edited notes</h2>
        <ul>
        {
          data.get('results').map(note =>
            <li key={note.get('id')}>
              <a href={note.get('url')}>{ note.get('title') }</a>
              {' (by '}
              <a href={note.getIn(['project', 'url'])}>
               { note.getIn(['project', 'name']) }
              </a>
              {')'}
            </li>
          )
        }
        </ul>
      </div>
    )
  }
});


module.exports = React.createClass({
  displayName: 'Homepage',

  render() {
    var { user } = this.props
      , HomeComponent = user ? UserHomepage : NonUserHomepage

    return <HomeComponent {...this.props} />
  }
});
