"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , UserHomepage
  , NonUserHomepage

UserHomepage = React.createClass({
  getInitialState() {
    return { activity: Immutable.List() }
  },

  componentDidMount() {
    var getLinks = require('../../../helpers/get_links')
      , { user } = this.props
      , activityURL = getLinks(user).getIn(['activity', 'href'])

    fetch(activityURL, { headers: { Accept: 'application/json' }})
      .then(response => response.json())
      .then(data => data.activity)
      .then(Immutable.fromJS)
      .then(activity => this.setState({ activity }))
  },

  render() {
    var ActivityList = require('./activity_list.jsx')
      , { user } = this.props
      , { activity } = this.state

    return (
      <div>
        <div>
          <a href="/auth/account/">Account settings</a>
          <hr />
        </div>

        <div className="row">
          <div className="span6">
            <h3>My projects</h3>
            { user.get('project_roles').map((role, i) =>
                <div key={i}>
                  <h3><a href={role.get('project_url')}>{ role.get('project') }</a></h3>
                  <div>
                    <a className="btn btn-primary" href={ role.get('project_url') + 'notes/add/' }>
                      Add note
                    </a>
                  </div>
                </div>
              )
            }
          </div>
          <div className="span6">
            <h3>Recent activity</h3>
            <ActivityList activities={activity} />
          </div>
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
