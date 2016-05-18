"use strict";

module.exports = function (propertyName="data") {
  return function mapStateToProps(state) {
    return {
      [propertyName]: state.getIn(['resources', state.get('currentAPIPath')])
    }
  }
}
