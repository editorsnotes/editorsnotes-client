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

    this.setState({
      activity: Immutable.fromJS(JSON.parse(localStorage.myActivity || '[]'))
    });

    fetch(activityURL, { headers: { Accept: 'application/json' }})
      .then(response => response.json())
      .then(data => {
        var activity = data.results;

        window.localStorage.myActivity = JSON.stringify(activity);
        return Immutable.fromJS(activity);
      })
      .then(Immutable.fromJS)
      .then(activity => this.setState({ activity }))
  },

  render() {
    var ActivityList = require('./activity_list.jsx')
      , { getPredicateLiteral, getLinkURI } = require('../../../utils/store')
      , { store } = this.props
      , { activity } = this.state
      , projects

    projects = store
      .find(null, 'rdf:type', 'wn:Project')
      .map(({ subject }) => ({
        uri: subject,
        createNoteLink: getLinkURI(
            store,
            `${subject}vocab#Note`,
            'hydra:CreateResourceOperation')
      }));

    return (
      <div>
        <div>
          <a href="/auth/account/">Account settings</a>
          <hr />
        </div>

        <div className="clearfix">
          <div className="col col-6">
            <h3>My projects</h3>
            {
              projects.map(project =>
                <div key={project.uri}>
                  <h3>
                    <a href={project.uri}>
                      { getPredicateLiteral(store, project.uri, 'schema:name') }
                    </a>
                  </h3>
                  <div>
                  <a className="btn btn-primary" href={project.createNoteLink + 'add/'}>
                    Add note
                  </a>
                  </div>
                </div>
              )
            }
          </div>
          <div className="col col-6">
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
