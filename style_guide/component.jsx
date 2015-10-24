"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , StyleGuideComponent

StyleGuideComponent = React.createClass({
  displayName: 'StyleGuide',

  propTypes: {
    Component: React.PropTypes.element.isRequired,
    componentProps: React.PropTypes.object,
  },

  getDefaultProps() {
    return { componentProps: {} }
  },

  render() {
    var { Component, componentProps } = this.props

    return (
      <div>
        <h2>{ Component.name }</h2>
        <h3>Example</h3>
        <Component {...componentProps} />
      </div>
    )
  }
});

module.exports = React.createClass({
  render() {
    var Header = require('../src/components/main/header/component.jsx')
      , RelatedTopicSelector = require('../src/components/shared/related_topic_selector/component.jsx')

    return (
      <div>
        <StyleGuideComponent
            Component={Header}
            componentProps={{
              loading: false,
              user: Immutable.Map({
                url: '/',
                display_name: 'Patrick Golden'
              })
            }} />


        <StyleGuideComponent
            Component={RelatedTopicSelector}
            componentProps={{
              topics: Immutable.Set([
                Immutable.Map({ id: 1, preferred_name: 'Emma Goldman' }),
                Immutable.Map({ id: 2, preferred_name: 'Alexander Berkman' })
              ])
            }} />
      </div>
    )
  }
});
