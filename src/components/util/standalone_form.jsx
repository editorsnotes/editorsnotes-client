"use strict";

const React = require('react')
    , Immutable = require('immutable')
    , SaveButton = require('../shared/save_button.jsx')
    , { connect } = require('react-redux')
    , { getType } = require('../../helpers/api')


const types = Immutable.Map([
  [require('../../records/note'), 'note'],
  [require('../../records/topic'), 'topic'],
  [require('../../records/document'), 'document']
])


module.exports = function (Component, RecordType) {
  const type = types.get(RecordType);

  const StandaloneForm = React.createClass({
    propTypes: {
      data: React.PropTypes.instanceOf(Immutable.Map),
    },

    getInitialState() {
      return {
        [type]: this.originalData(),
        errors: null,
      }
    },

    componentDidMount() {
      window.onbeforeunload = () => {
        const updated = this.state[type]
            , original = this.originalData()

        if (!updated.equals(original)) {
          return 'There are unsaved changes. They will be lost if you close this page.';
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

    handleSaveSuccess(request) {
      const redirect = this.isNew()
          ? request.responseHeaders.Location
          : this.props.data.get('url')

      window.onbeforeunload = null;
      window.location.href = redirect;
    },

    handleError(errors) {
      this.setState({ errors })
    },

    getIDAndRecord() {
      const id = this.isNew() ? null : this.props.data.get('id')
          , record = this.state[type]

      return [ id, record ]
    },

    render() {
      return (
        <Component
          {...this.props}
          {...this.state}
          data={this.isNew() ? null : this.props.data}
          project={this.isNew() ? this.props.data : undefined}
          handleRecordChange={this.handleRecordChange}
          saveButton={
            <SaveButton
              getIDAndRecord={this.getIDAndRecord}
              onSuccess={this.handleSaveSuccess}
              onError={this.handleError}
            />
          }
        />
      )
    }
  });

  return connect(require('../main/default_api_mapper'))(StandaloneForm);
}
