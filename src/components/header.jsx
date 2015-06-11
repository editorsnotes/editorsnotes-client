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

              <ul data-fixme="auth-menu" className="nav pull-right">
                <li data-fixme="auth-menu-signed-out"><a href="/login/">Log in</a></li>
                <li data-fixme="auth-menu-signed-in"><a href="#"></a></li>
              </ul>
            </div>
          </div>
        </div>
    )
  }
});
