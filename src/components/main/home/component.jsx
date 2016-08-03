"use strict";

const React = require('react')
    , Immutable = require('immutable')
    , { connect } = require('react-redux')

const UserHomepage = require('./logged_in_homepage.jsx')
    , NonUserHomepage = require('./default_homepage.jsx')


function mapStateToProps(state) {
  return {
    user: state.getIn(['user', 'data']),
  }
}

const Homepage = ({ user }) =>
  !user ? <NonUserHomepage /> : <UserHomepage />

Homepage.propTypes = {
  user: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = connect(mapStateToProps)(Homepage)
