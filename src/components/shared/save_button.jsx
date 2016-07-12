"use strict";

const React = require('react')
    , Immutable = require('immutable')
    , ItemEditor = require('../util/item_editor.jsx')
    , { APIRequest } = require('../../records/state')

const SaveButton = React.createClass({
  propTypes: {
    getIDAndRecord: React.PropTypes.func.isRequired,

    onError: React.PropTypes.func.isRequired,
    onSuccess: React.PropTypes.func.isRequired,

    /* from ItemEditor */
    save: React.PropTypes.func.isRequired,
    request: React.PropTypes.instanceOf(APIRequest),

    completed: React.PropTypes.bool.isRequired,
    loading: React.PropTypes.bool.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map),
  },

  componentWillReceiveProps(nextProps) {
    const { onError, onSuccess } = this.props
        , { request } = nextProps

    if (!this.props.completed && nextProps.completed) {
      onSuccess(request);
    } else if (!this.props.errors && nextProps.errors) {
      onError(nextProps.errors, request);
    }
  },

  handleClick() {
    const { getIDAndRecord, save } = this.props
        , [ itemID, record ] = getIDAndRecord()

    save(itemID, record);
  },

  render() {
    const { loading, completed } = this.props

    return (
      <button
          className="btn btn-primary"
          onClick={this.handleClick}
          disabled={loading || completed}
          style={{
            height: '40px',
            width: '104px',
            fontSize: '16px'
          }}>
        Save
      </button>
    )
  }
});

module.exports = ItemEditor(SaveButton);
