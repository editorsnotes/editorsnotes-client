"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'Header',

  propTypes: {
    loading: React.PropTypes.bool.isRequired
  },

  renderAuth() {
    var { user, path } = this.props
      , loginURL = '/auth/signin'

    if (path !== '/') {
      loginURL += ('?return_to=' + path)
    }

    return !user ?
      <a href={loginURL} className="silver">Sign in</a> :
      <div>
        <span key={1} className="silver">Logged in as </span>
        <a key={2} href={user.get('url')} className="silver bold">
          { user.get('display_name') }
        </a>
        {
          /*
        <span key={3}>
          <a href="/auth/signout">Sign out</a>
        </span>
          */
        }
      </div>
  },

  render: function () {
    var classnames = require('classnames')
      , { noContainer } = this.props

    return (
      <nav className={classnames('bg-black', {
        mb2: !noContainer
      })}>
        <div className="px3 py1 bg-lighten-1">
          <div className="container flex flex-center flex-justify">
            <div className="h2">
              <a className="silver" href="/">Working Notes</a>
            </div>

            <form action="/search/" method="get">
              <input
                  type="text"
                  className="field"
                  name="q"
                  placeholder="Search" />
            </form>

            { /* <Spinner spin={loading} /> */ }

            { this.renderAuth() }
          </div>
        </div>
      </nav>
    )
  }
});
