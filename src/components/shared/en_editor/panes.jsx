"use strict";

var React = require('react')
  , classnames = require('classnames')


function paneClassName(type, selected) {
  return classnames('btn mr1', { 'bg-silver': type === selected });
}

module.exports = React.createClass({
  displayName: 'Panes',

  propTypes: {
  },

  getInitialState() {
    return { currentPane: 'references' }
  },

  render() {
    var Help = require('./help.jsx')
      , References = require('./references.jsx')
      , { currentPane } = this.state

    return (
      <div className="absolute-full-height flex flex-column">
        <div className="p2 border-bottom">
          {/* <button className="btn">Table of Contents</button> */}

          <button
              className={paneClassName('references', currentPane)}
              onClick={() => this.setState({ currentPane: 'references' })}>
            References
          </button>

          <button
              className={paneClassName('browser', currentPane)}
              onClick={() => this.setState({ currentPane: 'browser' })}>
            Browser
          </button>

          <button
              className={paneClassName('help', currentPane)}
              onClick={() => this.setState({ currentPane: 'help' })}>
            Help
          </button>
        </div>

        <div className="flex-grow relative">
          <div className="absolute-full-height" style={{ overflowY: 'scroll', }}>
            <div className="p2">

              <div className={classnames({ 'display-none': currentPane !== 'help' })}>
                <Help />
              </div>

              <div className={classnames({ 'display-none': currentPane !== 'browser' })}>
                The browser
              </div>

              <div className={classnames({ 'display-none': currentPane !== 'references' })}>
                <References {...this.props} />
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
});
