"use strict";

var React = require('react')
  , StyleGuideComponent

StyleGuideComponent = React.createClass({
  displayName: 'StyleGuide',

  propTypes: {
    Component: React.PropTypes.element.isRequired,
    examples: React.PropTypes.array,
  },

  getDefaultProps() {
    return { componentProps: {} }
  },

  render() {
    var { Component, examples } = this.props
      , { displayName } = Component

    return (
      <div id={displayName} className="py3 border-bottom">
        <h2 className="p0 m0">
          <a className="absolute mxn2" href={`#${displayName}`}>#</a>
          <span>{ displayName }</span>
        </h2>

        {
          examples.map(example =>
            <div>
              <h3>
                Example{example.title && ': ' + example.title}
              </h3>
              <div className="px2">
                <Component {...example.props} />
              </div>
            </div>
          )
        }

      </div>
    )
  }
});

module.exports = React.createClass({
  render() {
    var guides = require('./example')

    return (
      <div className="px4">
        <div>
          <h1>Working Notes style guide</h1>
        </div>
        { guides.map(guide => <StyleGuideComponent {...guide} />) }
      </div>
    )
  }
});
