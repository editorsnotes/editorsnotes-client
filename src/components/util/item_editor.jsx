"use strict";

const React = require('react')
    , { connect } = require('react-redux')
    , { saveItem } = require('../../actions')


const {
  SUCCESS,
  PENDING,
} = require('../../types').readyStates

function mapStateToProps({ activeRequests }, { requestID }) {
  const request = requestID && activeRequests.get(requestID)

  return {
    request,
    completed: request && request.readyState === SUCCESS,
    loading: request && request.readyState === PENDING,
    errors: request && request.responseError,
  }
}

function mapDispatchToProps(dispatch, { projectURL }) {
  return {
    save: (itemID, record) => dispatch(saveItem(itemID, projectURL, record))
  }
}

module.exports = function itemEditor(Component) {
  let ItemEditor = React.createClass({
    propTypes: {
      save: React.PropTypes.func.isRequired,
      projectURL: React.PropTypes.string.isRequired,
    },

    getInitialState() {
      return { requestID: null }
    },

    save(itemID, record) {
      const { save } = this.props
          , { requestID } = save(itemID, record)

      this.setState({ requestID })
    },

    render() {
      return (
        <Requestor
          {...this.props}
          {...this.state}
          save={this.save}
        />
      )
    }
  });
  ItemEditor = connect(null, mapDispatchToProps)(ItemEditor);

  let Requestor = React.createClass({
    render() {
      return <Component {...this.props} />
    }
  })
  Requestor = connect(mapStateToProps)(Requestor);

  return ItemEditor;
}
