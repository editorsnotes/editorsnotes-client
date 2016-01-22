"use strict";

/* eslint camelcase:0 */

var React = require('react')
  , Immutable = require('immutable')
  , Editable = require('../../util/editable_component.jsx')
  , Translate = require('../translate.jsx')
  , commonStrings = require('../../common_strings')
  , strings = require('./strings')
  , AddInlineItem


const FORM_COMPONENTS = {
  note: require('../note_form/component.jsx'),
  topic: require('../topic_form/component.jsx'),
  document: require('../document_form/component.jsx'),
}


function makeItem(type, text) {
  var Note = require('../../../records/note')
    , Topic = require('../../../records/topic')
    , Document = require('../../../records/document')

  switch (type) {
  case 'note':
    return new Note({ title: text });
  case 'topic':
    return new Topic({ preferred_name: text });
  case 'document':
    return new Document({ description: text });
  }
}


AddInlineItem = React.createClass({
  propTypes: {
    onSelect: React.PropTypes.func.isRequired,
    type: React.PropTypes.string.isRequired,
    projectURL: React.PropTypes.string.isRequired,
    initialText: React.PropTypes.string.isRequired,

    /* from Editable */
    save: React.PropTypes.func.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map),
    loading: React.PropTypes.bool.isRequired
  },

  getInitialState() {
    return { item: null }
  },

  handleSave() {
    var { save, projectURL, onSelect } = this.props
      , { item } = this.state

    save(null, projectURL, item)
      .then(resp => resp.json())
      .then(Immutable.fromJS)
      .then(onSelect)
  },

  componentWillMount() {
    var { type, initialText } = this.props
      , item = makeItem(type, initialText)

    this.setState({ item });
  },

  render() {
    var Spinner = require('../spinner/component.jsx')
      , { type, loading, onCancel } = this.props
      , { item } = this.state
      , FormComponent = FORM_COMPONENTS[type]
      , formProps = { [type]: item }

    return (
      <div>
        <h2><Translate text={strings[`add${type}`]} /></h2>

        <div className="flex relative" style={{ height: '600px' }}>
          <FormComponent
              {...this.props}
              onChange={updatedItem => this.setState({ item: updatedItem })}
              minimal={true}
              {...formProps} />
        </div>

        <div>
          <button onClick={this.handleSave} className="btn btn-primary">
            <Translate text={commonStrings.save} />
          </button>
          <button className="btn btn-danger" onClick={onCancel}>
            <Translate text={commonStrings.cancel} />
          </button>
          <Spinner spin={loading} />
        </div>
      </div>
    )
  }
});

module.exports = Editable(AddInlineItem);
