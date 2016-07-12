"use strict";

const React = require('react')
    , { connect } = require('react-redux')
    , { saveItem } = require('../../actions')


const {
  SUCCESS,
  PENDING,
} = require('../../types').readyStates

function mapStateToProps({ requests }, { requestID }) {
  const request = requestID && requests.get(requestID)

  return {
    request,
    completed: request ? request.readyState === SUCCESS : false,
    loading: request ? request.readyState === PENDING : false,
    errors: request && request.responseError,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    save: (itemID, record) => dispatch(saveItem(itemID, record))
  }
}

module.exports = function itemEditor(Component) {
  let ItemEditor = React.createClass({
    propTypes: {
      /* From mapDispatchToProps */
      save: React.PropTypes.func.isRequired,
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
