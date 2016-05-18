"use strict";

const React = require('react')
    , { connect } = require('react-redux')

const Translate = require('../../shared/translate.jsx')

function mapStateToProps(state) {
  return {
    store: state.get('tripleStore'),
  }
}

const LoggedInUserHomepage = React.createClass({
  propTypes: {
    store: React.PropTypes.object.isRequired
  },

  /*
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
  */

  render() {
    const { getPredicateLiteral, getLinkURI } = require('../../../utils/store')
        , { store } = this.props

    const projects = store
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
            <h3><Translate text="My projects" /></h3>
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
          {/*
          <div className="col col-6">
            <h3>Recent activity</h3>
            <ActivityList activities={activity} />
          </div>
          */}
        </div>
      </div>
    )
  }
});

module.exports = connect(mapStateToProps)(LoggedInUserHomepage);
