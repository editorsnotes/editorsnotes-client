"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , editableComponent = require('./editable_component.jsx')
  , { connect } = require('react-redux')
  , { getType } = require('../../helpers/api')


const types = Immutable.Map([
  [require('../../records/note'), 'note'],
  [require('../../records/topic'), 'topic'],
  [require('../../records/document'), 'document']
])


module.exports = function (Component, RecordType) {
  const type = types.get(RecordType);

  var StandaloneForm = React.createClass({
    getInitialState() {
      return {
        [type]: this.originalData(),

        // FIXME
        loading: false,
        errors: Immutable.Map()
      }
    },

    componentDidMount() {
      window.onbeforeunload = () => {
        var updated = this.state[type]
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
      let recordData

      const { data } = this.props

      if (getType(data) === 'Project') {
        recordData = {};
      } else if (type === 'topic') {
        recordData = data.getIn(['wn_data', '@graph', '@graph'])
      } else {
        recordData = data;
      }

      return new RecordType(recordData);
    },

    isNew() {
      return getType(this.props.data) === 'Project'
    },

    getProjectURL() {
      return this.isNew()
        ? this.props.data.get('url')
        : this.props.data.get('project')
    },

    handleRecordChange(updatedRecord) {
      this.setState({ [type]: updatedRecord });
    },

    handleSaveSuccess(response) {
      var redirect = this.isNew()
        ? response.headers.get('Location')
        : this.props.data.get('url')

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
            data={this.isNew() ? null : this.props.data}
            project={this.isNew() ? this.props.data : undefined}
            projectURL={this.getProjectURL()}
            handleRecordChange={this.handleRecordChange}
            saveAndRedirect={this.saveAndRedirect} />
      )
    }
  });

  return connect(require('../main/default_api_mapper'))(StandaloneForm);
}
