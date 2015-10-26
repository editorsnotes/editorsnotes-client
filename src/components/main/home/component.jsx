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
    var { user } = this.props
      , activityURL = user.get('activity')

    fetch(activityURL, { headers: { Accept: 'application/json' }})
      .then(response => response.json())
      .then(data => data.results)
      .then(Immutable.fromJS)
      .then(activity => this.setState({ activity }))
  },

  render() {
    var ActivityList = require('./activity_list.jsx')
      , { getEmbedded } = require('../../../helpers/api')
      , { user, data } = this.props
      , { activity } = this.state
      , projects

    projects = data.get('affiliated_projects')

    return (
      <div>
        <div>
          <a href="/auth/account/">Account settings</a>
          <hr />
        </div>

        <div className="row">
          <div className="span6">
            <h3>My projects</h3>
            {
              projects.map((project, i) =>
                <div key={i}>
                  <h3><a href={project.get('url')}>{ project.get('name') }</a></h3>
                  <div>
                    <a className="btn btn-primary" href={project.get('notes') + 'add/'}>
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
    return (
      <div>
        <h1>Working Notes</h1>
        <p className="large">
          Working Notes is an <a href="http://github.com/editorsnotes">open-source</a>, web-based tool for recording, organizing, preserving, and opening access to research notes, built with the needs of documentary editing projects, archives, and library special collections in mind.
        </p>

        <h2>Sign up</h2>
        <p><a href="/auth/account/create">Create an account</a></p>
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
