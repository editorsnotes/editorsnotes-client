"use strict";

var React = require('react')


function CodeMirror() {
  return (
    <div className="absolute bg-lightgray" style={{
      overflowY: 'scroll',
      left: 0,
      right: 0,
      height: '100%',
    }}>
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
    return (
      <div className="absolute flex flex-column" style={{
        left: 0,
        right: 0,
        height: '100%'
      }}>
        <div className="flex-grow relative">
          <CodeMirror />
        </div>
      </div>
    )
  }
});
