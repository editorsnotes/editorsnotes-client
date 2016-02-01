"use strict";

var React = require('react')
  , classnames = require('classnames')


function paneClassName(type, selected) {
  return classnames('btn mr1', { 'bg-silver': type === selected });
}

module.exports = React.createClass({
  displayName: 'Panes',

  propTypes: {
    // Additional panes should be an array of objects with the following
    // keys:
    //   1. 'key' (the key of the react element)
    //   2. 'label' (the label that the pane will be listed under)
    //   3. 'render' (the function to be called to render the pane)
    additionalPanes: React.PropTypes.array,
    defaultPane: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      additionalPanes: [],
      defaultPane: 'references'
    }
  },

  getInitialState() {
    var { defaultPane } = this.props

    return { currentPane: defaultPane }
  },

  render() {
    var Help = require('./help.jsx')
      , References = require('./references.jsx')
      , { additionalPanes } = this.props
      , { currentPane } = this.state

    return (
      <div className="absolute-full-height flex flex-column">
        <div className="p2 border-bottom">
          <span>
            {
              additionalPanes.map(pane =>
                <button
                    key={pane.key}
                    className={paneClassName(pane.key, currentPane)}
                    onClick={() => this.setState({ currentPane: pane.key })}>
                  { pane.label }
                </button>
              )
            }
          </span>

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
              <div>
                {
                  additionalPanes.map(pane =>
                    <div
                        key={pane.key}
                        className={classnames({ 'display-none': currentPane !== pane.key })}>
                      { pane.render() }
                    </div>
                  )
                }
              </div>
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
