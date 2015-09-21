"use strict";

var React = require('react')

module.exports = React.createClass({
  propTypes: {
    loading: React.PropTypes.bool.isRequired
  },

  render: function () {
    var Spinner = require('../shared/spinner/component.jsx')
      , { loading } = this.props

    return (
      <div className="navbar">
        <div className="navbar-inner">
          <div className="container">
            <ul className="nav">
              <li><a className="brand" href="/">Working Notes</a></li>
              <li><Spinner spin={loading} /></li>
              {
                /*
                <li><a href="/browse/">Browse</a></li>
                <li><a href="/about/">About</a></li>
                */
              }
              <li className="divider-vertical"></li>
              <form className="navbar-search" action="/search/" method="get">
                <input type="text" className="search-query search-autocomplete" name="q" x-search-target="topics" placeholder="Search" />
              </form>
            </ul>

              <ul className="nav pull-right">
                {
                  !this.props.user ?
                    <li><a href="/auth/signin">Log in</a></li> :
                    [
                      <li key="logged-in-user">
                        <p className="navbar-text">
                          Logged in as {this.props.user.get('display_name')}
                        </p>
                      </li>,
                      <li key="log-out">
                        <a href="/auth/signout" onClick={this.handleLogOut}>Log out</a>
                      </li>
                    ]
                }
              </ul>
            </div>
          </div>
        </div>
    )
  }
});
