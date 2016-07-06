"use strict";

const React = require('react')
    , classnames = require('classnames')
    , { connect } = require('react-redux')

const Router = require('../router')
    , { Route } = require('../records/state')
    , Header = require('./main/header/component.jsx')
    , Footer = require('./main/footer/component.jsx')


function mapStateToProps(state) {
  return {
    currentRoute: new Route(state.getIn(['application', 'current'])),
    nextRoute: new Route(state.getIn(['application', 'next']))
  }
}

const Application = React.createClass({
  propTypes: {
    router: React.PropTypes.instanceOf(Router).isRequired,
    currentRoute: React.PropTypes.instanceOf(Route),
    nextRoute: React.PropTypes.instanceOf(Route),
  },

  render() {
    const { router, currentRoute } = this.props

    let child = null
      , childProps = {}

    const match = router.match(currentRoute.get('path'))

    if (match) {
      const { Component, componentProps } = match.handler

      if (componentProps) childProps = componentProps()
      child = <Component {...childProps} />
    } else {
      child = <span>Could not find { currentRoute.get('path') }</span>
    }


    return (
      <div className="flex flex-column" style={{ minHeight: '100vh' }}>
        <Header {...childProps} />

        <main className="flex-grow relative">
          <div className={classnames({ container: !childProps.noContainer })}>
            { child }
          </div>
        </main>

        <Footer {...childProps} />
      </div>
    )
  }
});

module.exports = connect(mapStateToProps)(Application);
