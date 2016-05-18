"use strict";

const React = require('react')
    , classnames = require('classnames')

const Header = require('./main/header/component.jsx')
    , Footer = require('./main/footer/component.jsx')

module.exports = React.createClass({
  displayName: 'Application',

  propTypes: {
    noContainer: React.PropTypes.bool,
    children: React.PropTypes.element.isRequired
  },

  render() {
    const { children, noContainer } = this.props

    return (
      <div className="flex flex-column" style={{ minHeight: '100vh' }}>
        <Header {...this.props} />

        <main className="flex-grow relative">
          <div className={classnames({ container: !noContainer })}>
            { children }
          </div>
        </main>

        <Footer {...this.props} />
      </div>
    )
  }
});
