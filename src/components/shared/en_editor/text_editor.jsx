"use strict";

var React = require('react')


function CodeMirror() {
  return (
    <div className="absolute-full-height bg-lightgray" style={{ overflowY: 'scroll' }}>
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
      <div className="absolute-full-height flex flex-column">
        <div className="flex-grow relative">
          <CodeMirror />
        </div>
      </div>
    )
  }
});
