"use strict";

/* eslint camelcase:0 */

const React = require('react')
    , Immutable = require('immutable')
    , Translate = require('./translate.jsx')
    , ItemEditor = require('../util/item_editor.jsx')
    , commonStrings = require('../common_strings')


const FORM_COMPONENTS = {
  note: require('./note_form/component.jsx'),
  topic: require('./topic_form/component.jsx'),
  document: require('./document_form/component.jsx'),
}


function makeItem(type, text) {
  const Note = require('../../records/note')
      , Topic = require('../../records/topic')
      , Document = require('../../records/document')

  switch (type) {
  case 'note':
    return new Note({ title: text });
  case 'topic':
    return new Topic({ preferred_name: text });
  case 'document':
    return new Document({ description: text });
  }
}


const AddInlineItem = React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    onSelect: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    type: React.PropTypes.string.isRequired,
    initialText: React.PropTypes.string.isRequired,
    autofocus: React.PropTypes.bool,

    /* from ItemEditor */
    save: React.PropTypes.func.isRequired,
    errors: React.PropTypes.instanceOf(Immutable.Map),
    loading: React.PropTypes.bool.isRequired
  },

  getInitialState() {
    return { item: null }
  },

  componentWillMount() {
    const { type, initialText } = this.props
        , item = makeItem(type, initialText)

    this.setState({ item });
  },

  componentDidMount() {
    const { autofocus } = this.props

    if (!autofocus) return;

    const firstInput = this.refs.form.querySelector('input');

    if (firstInput) {
      firstInput.focus();
      firstInput.value = firstInput.value;
    }
  },

  render() {
    const Spinner = require('./spinner/component.jsx')
        , spinnerOpts = require('./spinner/opts')
        , { type, loading, onCancel, className } = this.props
        , { item } = this.state
        , FormComponent = FORM_COMPONENTS[type]
        , formProps = { [type]: item }

    return (
      <div className={className}>
        <div className="flex flex-justify flex-center" style={{
          paddingBottom: '1rem',
          borderBottom: '1px solid #ccc'
        }}>
          <h2><Translate text={commonStrings[`add${type}`]} /></h2>
          <div>
            <button
                className="btn btn-outline mr2"
                disabled={loading}
                style={{ width: '85px', height: '32px' }}
                onClick={onCancel}>
              <Translate text={commonStrings.cancel} />
            </button>
            <button
                className="btn btn-primary relative"
                disabled={loading}
                style={{ width: '85px', height: '32px' }}
                onClick={this.handleSave} >
              <Translate text={commonStrings.save} />
              <Spinner spin={loading} opts={Object.assign({}, spinnerOpts.compact, {
                scale: 1,
                width: 2,
                left: '85%'
              })} />
            </button>
          </div>
      </div>

        <div ref="form" className="flex relative">
          <FormComponent
              {...this.props}
              onChange={updatedItem => this.setState({ item: updatedItem })}
              minimal={true}
              embeddedItems={Immutable.OrderedSet()}
              onAddEmbeddedItem={() => null}
              {...formProps} />
        </div>

      </div>
    )
  }
});

module.exports = ItemEditor(AddInlineItem);
