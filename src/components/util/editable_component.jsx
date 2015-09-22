"use strict";

/* eslint no-alert:0 */

var React = require('react')
  , Immutable = require('immutable')

module.exports = function makeEditableComponent(Component, type) {
  var EditableComponent = React.createClass({
    getInitialState() {
      return {
        errors: Immutable.Map(),
        loading: false
      }
    },

    save(id, projectURL, data) {
      var saveItem = require('../../utils/save_item')
        , handleResponse = require('../../utils/handle_response')

      this.setState({
        errors: Immutable.Map(),
        loading: true
      });

      return saveItem(type, id, projectURL, data)
        .then(this.onSaveFinish, this.onSaveFinish)
        .then(handleResponse, this.handleNetworkError)
        .catch(this.handleSaveError)
    },

    handleNetworkError(err) {
      alert('Network error: \n' + err.toString());
    },

    handleSaveError(err) {
      var errorObj = err.data || { [type]: [err.message] || err.toString() }
        , errors = Immutable.fromJS(errorObj)

      this.setState({ errors });

      // Rethrow error?
      // throw err;
    },

    onSaveFinish(resp) {
      this.setState({ loading: false });

      if (resp instanceof Error) {
        throw resp;
      } else {
        return resp;
      }
    },

    render() {
      return <Component {...this.state} {...this.props} save={this.save} />
    }
  });

  return EditableComponent;
}
