"use strict";

const React = require('react')
    , Immutable = require('immutable')
    , classnames = require('classnames')
    , { connect } = require('react-redux')

function mapStateToProps(state) {
  return {
    user: state.getIn(['user', 'data']),
    path: state.getIn(['application', 'current', 'path']),
  }
}

const UserMenu = ({ user, path }) => (
  !user
    ? <a href={`/auth/signin?return_to=${path}`}>Sign in</a>
    : <div>
        <span className="silver">Logged in as </span>
        <a href={user.get('url')} className="silver bold">
          { user.get('display_name') }
        </a>
        {/* <a href="/auth/signout">Sign out</a> */ }
      </div>
)

const Header = ({ user, path, noContainer }) =>
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

        <UserMenu user={user} path={path} />
      </div>
    </div>
  </nav>

Header.propTypes = UserMenu.propTypes = {
  path: React.PropTypes.string.isRequired,
  user: React.PropTypes.instanceOf(Immutable.Map),
  noContainer: React.PropTypes.bool
}

module.exports = connect(mapStateToProps)(Header);
