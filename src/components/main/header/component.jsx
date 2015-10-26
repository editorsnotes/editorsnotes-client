"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'Header',

  propTypes: {
    loading: React.PropTypes.bool.isRequired
  },

  renderAuth() {
    var { user } = this.props

    return !user ?
      <a href="/auth/signin" className="silver">Sign in</a> :
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
    var Spinner = require('../../shared/spinner/component.jsx')
      , { loading } = this.props

    return (
      <nav className="bg-black mb2">
        <div className="px3 py1 bg-lighten-1">
          <div className="container flex flex-center flex-justify">
            <div className="h2">
              <a className="silver" href="/">Working Notes</a>
            </div>

            <form action="/search/" method="get">
              <input type="text" name="q" x-search-target="topics" placeholder="Search" />
            </form>

            { /* <Spinner spin={loading} /> */ }

            { this.renderAuth() }
          </div>
        </div>
      </nav>
    )
  }
});
