"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = function makeHydraLinkAware(Component) {
  var HydraAwareComponent = React.createClass({
    propTypes: {
      data: React.PropTypes.instanceOf(Immutable.Map)
    },

    hasHydraOperation(type) {
      var { data } = this.props

      return data
        .get('hydra:operation')
        .some(operation => (
          operation.get('type') === `hydra:${type}ResourceOperation`))
    },

    canCreate() {
      return this.hasHydraOperation('Create')
    },

    canReplace() {
      return this.hasHydraOperation('Replace')
    },

    canDelete() {
      return this.hasHydraOperation('Delete')
    },

    render() {
      return (
        <Component
          {...this.props}
          canCreate={this.canCreate}
          canReplace={this.canReplace}
          canDelete={this.canDelete} />
        )
    }
  });

  return HydraAwareComponent
}
