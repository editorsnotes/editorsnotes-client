"use strict";

var React = require('react')


module.exports = React.createClass({
  displayName: 'ENContentEditor',

  propTypes: {
  },

  render() {
    var TextEditor = require('./text_editor.jsx')
      , Panes = require('./panes.jsx')

    return (
      <div className="flex-grow flex flex-stretch bg-white">
        <div className="flex-grow" ref="left-pane">
          <TextEditor />
        </div>

        <div ref="dragger" style={{
          width: '3px',
          background: '#ccc'
        }} />


        <div className="flex-grow" ref="right-pane">
          <Panes />
        </div>
      </div>
    )
  }
});
