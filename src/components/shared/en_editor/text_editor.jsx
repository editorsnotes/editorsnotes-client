"use strict";

var React = require('react')


const TOOLBAR_HEIGHT = '4em';

function TopBar({}) {
  var style = { height: TOOLBAR_HEIGHT, lineHeight: TOOLBAR_HEIGHT, padding: '0 1em' }

  return (
    <div className="bg-gray border-box col-12 right-align" style={style}>
      <button className="btn bg-white btn-outline mr2">Help</button>
      <button className="btn btn-primary">Save</button>
    </div>
  )
}


function CodeMirror() {
  return (
    <div className="absolute bg-lightgray" style={{
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
