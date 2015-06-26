"use strict";

var React = require('react')

module.exports = React.createClass({
  render: function () {
    return (
      <div className="navbar">
        <div className="navbar-inner">
          <div className="container">
            <ul className="nav">
              <li><a className="brand" href="/">Editors' Notes</a></li>
              <li className="divider-vertical"></li>
              <li><a href="/browse/">Browse</a></li>
              <li><a href="/about/">About</a></li>
              <li className="divider-vertical"></li>
              <form className="navbar-search" action="/search/" method="get">
                <input type="text" className="search-query search-autocomplete" name="q" x-search-target="topics" placeholder="Search" />
              </form>
            </ul>

              <ul className="nav pull-right">
                {
                  !this.props.user ?
                    <li><a href="/login/">Log in</a></li> :
                    [
                      <li key="logged-in-user"><p className="navbar-text">Logged in as {this.props.user.display_name} </p></li>,
                      <li key="log-out"><a href="/logout/">Log out</a></li>
                    ]
                }
              </ul>
            </div>
          </div>
        </div>
    )
  }
});
