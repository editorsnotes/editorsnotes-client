"use strict";

const N3 = require('n3')

module.exports = function mapStateToProps(state) {
  const apiResourceURL = state.get('currentAPIPath')
      , resource = state.getIn(['resources', apiResourceURL])

  let store = null;

  if (resource.get('triples')) {
    store = new N3.Store();
    store.addPrefixes(require('../../namespaces'));
    store.addTriples(resource.get('triples').toJS());
  }

  return resource.set('store', store).toObject();
}
