"use strict";

var React = require('react')


function TopBar() {
  return <div />
}


function CodeMirror() {
  return <div />
}


module.exports = React.createClass({
  displayName: 'TextEditor',

  propTypes: {
  },

  render() {
    return (
      <div>
        <TopBar />
        <CodeMirror />
      </div>
    )
  }
});
