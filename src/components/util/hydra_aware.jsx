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
        .get('hydra:operation', Immutable.List())
        .some(operation => (
          operation.get('@type') === `hydra:${type}ResourceOperation`))
    },

    canCreate() {
      return this.hasHydraOperation('Create')
    },

    canReplaceTopic() {
      var { getHydraLinks } = require('../../utils/store')
        , { store } = this.props

      return getHydraLinks(store).some(link => link.type === (
        "http://www.w3.org/ns/hydra/core#ReplaceResourceOperation"
      ));
    },

    canReplace() {
      var { getType } = require('../../helpers/api')
        , { data } = this.props

      return getType(data) === 'Topic' ?
        this.canReplaceTopic() :
        this.hasHydraOperation('Replace')
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
