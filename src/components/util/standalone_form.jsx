"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , editableComponent = require('./editable_component.jsx')
  , { connect } = require('react-redux')


const types = Immutable.Map([
  [require('../../records/note'), 'note'],
  [require('../../records/topic'), 'topic'],
  [require('../../records/document'), 'document']
])


module.exports = function (Component, RecordType) {
  var StandaloneForm = React.createClass({
    getInitialState() {
      return { [types.get(RecordType)]: this.originalData() }
    },

    componentDidMount() {
      window.onbeforeunload = () => {
        var updated = this.state[types.get(RecordType)]
          , original = this.originalData()

        if (!updated.equals(original)) {
          return 'There are unsaved pages on this page. Closing it will lose your changes.';
        }
      }
    },

    componentWillUnmount() {
      window.onbeforeunload = null;
    },

    originalData() {
      const { data } = this.props
          , type = types.get(RecordType)

      return new RecordType(
        (type === 'topic' && !this.isNew())
          ? data.getIn(['wn_data', '@graph', '@graph'])
          : data
      )
    },

    isNew() {
      return !this.props.data
    },

    getProjectURL() {
      return this.isNew() ?
        this.props.project.get('url') :
        this.props.data.get('project')
    },

    handleRecordChange(updatedRecord) {
      this.setState({ [types.get(RecordType)]: updatedRecord });
    },

    handleSaveSuccess(response) {
      var redirect = this.isNew() ?
        response.headers.get('Location') :
        this.props.data.get('url')

      window.onbeforeunload = null;
      window.location.href = redirect;
    },

    saveAndRedirect() {
      var { save } = this.props
        , updatedData = this.state[types.get(RecordType)]
        , id = this.isNew() ? null : this.props.data.get('id')

      save(id, this.getProjectURL(), updatedData).then(this.handleSaveSuccess);
    },

    render() {
      return (
        <Component
            {...this.props}
            {...this.state}
            projectURL={this.getProjectURL()}
            handleRecordChange={this.handleRecordChange}
            saveAndRedirect={this.saveAndRedirect} />
      )
    }
  });

  return connect(require('../main/default_api_mapper.js')())(
    StandaloneForm, types.get(RecordType))
}
