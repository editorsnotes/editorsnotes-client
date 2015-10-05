"use strict";

/* eslint no-alert:0 */

var React = require('react')
  , Immutable = require('immutable')

function typeFromRecord(record) {
  var Note = require('../../records/note')
    , Topic = require('../../records/topic')
    , Document = require('../../records/document')

  if (record instanceof Document) return 'document';
  if (record instanceof Topic) return 'topic';
  if (record instanceof Note) return 'note';

  throw new Error('Could not detect item type from record.');
}

// TODO: Decide on API. Should type be hardcoded, or should it be determined
// by record type?
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

      type = type || typeFromRecord(data);

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
      var errorObj = err.data || { NON_FIELD_ERRORS: [err.message] || err.toString() }
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
