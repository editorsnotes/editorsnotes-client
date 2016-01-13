"use strict";

var _ = require('underscore')
  , React = require('react')
  , ReactDOM = require('react-dom')
  , classnames = require('classnames')


const TOOLBAR_HEIGHT = '4em';

function TopBar({ width, fixed }) {
  var className
    , style = { height: TOOLBAR_HEIGHT, lineHeight: TOOLBAR_HEIGHT }

  return (
    <div className="bg-yellow col-12" style={style}>
      I am the toolbar
    </div>
  )
}


function CodeMirror() {
  return (
    <div className="absolute bg-green" style={{
      overflowY: 'scroll',
      left: 0,
      right: 0,
      height: '100%'
    }}>

      I am codemirror

    </div>
  )
}


module.exports = React.createClass({
  displayName: 'TextEditor',

  propTypes: {
  },

  getInitialState() {
    return { fixed: false }
  },

  render() {
    var { fixed } = this.state

    return (
      <div className="absolute flex flex-column" style={{
        left: 0,
        right: 0,
        height: '100%'
      }}>
        <div className="flex-none">
          <TopBar {...this.props} {...this.state} />
        </div>
        <div className="flex-grow relative">
          <CodeMirror />
        </div>
      </div>
    )
  }
});
