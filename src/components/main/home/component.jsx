"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , UserHomepage
  , NonUserHomepage
  , ChooseServerHomepage

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
      , { data } = this.props
      , { activity } = this.state
      , projects

    projects = data.get('affiliated_projects').toList();

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


ChooseServerHomepage = React.createClass({
  getInitialState() {
    return {
      domainValue: null,
      tokenValue: null
    }
  },

  handleSubmit(e) {
    var { domainValue, tokenValue } = this.state
      , key

    e.preventDefault();

    key = btoa(`${domainValue}|${tokenValue}`);
    this.saveRemoteServer(key);
    window.location.reload();
  },

  handleSelectServer(key) {
    localStorage.currentRemoteServer = key;
    window.location.reload();
  },

  getExistingServers() {
    return JSON.parse(localStorage.EN_REMOTE_SERVERS);
  },

  saveRemoteServer(server) {
    var servers = this.getExistingServers();
    servers[server] = (new Date()).getTime();
    localStorage.EN_REMOTE_SERVERS = JSON.stringify(servers);
  },

  render() {
    var { remoteServers, currentRemoteServer } = window.EditorsNotes
      , { domainValue, tokenValue } = this.state
      , currentRemoteServerKey = currentRemoteServer && currentRemoteServer.key

    return (
      <div>
        <h1>Choose server</h1>
        <table className="border" style={{ maxWidth: '600px' }}>
          <thead className="bg-gray">
            <tr>
              <td />
              <td>Domain</td>
              <td>API token</td>
              <td>Created</td>
              <td />
            </tr>
          </thead>
          <tbody>
            { !remoteServers.length && (
              <tr><td className="p2 center" colSpan="5">No servers defined.</td></tr>
            )}
            {
              remoteServers.map((server, i) =>
                <tr key={i}>
                  <td>
                    { server.key !== currentRemoteServerKey && (
                      <button
                          onClick={() => this.handleSelectServer(server.key)}
                          className="btn btn-outline btn-small">Use</button>
                    )}
                  </td>
                  <td>{ server.domain }</td>

                  {/* TODO: hide this except for onhover */}
                  <td>
                    <span className="block" title={server.token} style={{
                      width: '12ch',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      { server.token }
                    </span>
                  </td>
                  <td>{ (new Date(server.created)).toLocaleString() }</td>
                  <td>X</td>
                </tr>
              )
            }
          </tbody>
        </table>

        <h2>Add a remote server</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="mb1">
            <label style={{ width: "75px", display: 'inline-block' }} htmlFor="domainValue">Domain</label>
            <input
                id="domainValue"
                type="text"
                value={domainValue}
                onChange={e => this.setState({ domainValue: e.target.value })} />
          </div>
          <div className="mb1">
            <label style={{ width: "75px", display: 'inline-block' }} htmlFor="tokenValue">Token</label>
            <input
                id="tokenValue"
                type="text"
                value={tokenValue}
                onChange={e => this.setState({ tokenValue: e.target.value })} />
          </div>
          <div className="mt2">
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    )
  }
});


module.exports = React.createClass({
  displayName: 'Homepage',

  render() {
    var { clientRendered } = global.EditorsNotes
      , { user } = this.props
      , HomeComponent

    if (!clientRendered && !user) {
      HomeComponent = NonUserHomepage;
    } else if (clientRendered) {
      HomeComponent = ChooseServerHomepage;
    } else {
      HomeComponent = UserHomepage;
    }

    return <HomeComponent {...this.props} />
  }
});
