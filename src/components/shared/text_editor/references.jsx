"use strict";

/* eslint camelcase:0 */

var _ = require('underscore')
  , React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../translate.jsx')

const TEXT = {
  referencesHeader: 'References',
  referenceHint: "Type 'd' for document, 'n' for note, or 't' for topic.",

  findnote: "Find note",
  findtopic: "Find topic",
  finddocument: "Find document",

  addnote: 'Add note',
  addtopic: 'Add topic',
  adddocument: 'Add document',

}

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


module.exports = React.createClass({
  displayName: 'ReferenceHint',

  propTypes: {
    type: React.PropTypes.oneOf([null, 'empty', 'note', 'topic', 'document']),
    projectURL: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      searchText: '',

      fetching: false,
      matchResults: null,
      matchCount: null,
      searchedText: null,

      inlineItem: null
    }
  },

  componentWillMount() {
    this.fetchMatchingReferences = _.debounce(this.fetchMatchingReferences, 250);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.type !== this.props.type) {
      this.setState({ searchText: '' });
      this.resetSearchResults();
    }
  },

  resetSearchResults() {
    this.setState({
      matchResults: null,
      matchCount: null,
      searchedText: null,

      inlineItem: null
    })
  },

  focusAutocomplete() {
    React.findDOMNode(this.refs.autocomplete).focus();
  },

  fetchMatchingReferences() {
    var { type, projectURL } = this.props
      , { searchText } = this.state
      , listURL = `${projectURL}${type}s/?q=${searchText}`
      , stopSpinner = resp => { this.setState({ fetching: false }); return resp }
      , opts

    opts = {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    }

    this.resetSearchResults();

    this.setState({ fetching: true });

    fetch(listURL, opts)
      .then(stopSpinner, stopSpinner)
      .then(response => response.json())
      .then(Immutable.fromJS)
      .then(data => {
        if (searchText !== this.state.searchText) return;

        this.setState({
          matchResults: data.get('results'),
          matchCount: data.get('count'),
          searchedText: searchText
        });
      })
  },


  handleAddReference() {
    var { type } = this.props
      , { searchedText } = this.state

    this.setState({ inlineItem: makeItem(type, searchedText) });
  },

  handleAutocompleteChange(e) {
    var callback = e.target.value ?
      this.fetchMatchingReferences :
      this.resetSearchResults

    this.setState({ searchText: e.target.value }, callback);
  },

  handleSave() {
    var saveItem = require('../../../utils/save_item')
      , { type, projectURL } = this.props
      , { inlineItem } = this.state

    saveItem(type, null, projectURL, inlineItem);
  },

  renderInlineAddForm() {
    var { type, projectURL } = this.props
      , { inlineItem } = this.state
      , Form = FORM_COMPONENTS[type]
      , formProps = { [type]: inlineItem }

    // FIXME: Show errors correctly

    return (
      <div>
        <h2><Translate text={TEXT[`add${type}`]} /></h2>
        <Form
            projectURL={projectURL}
            minimal={true}
            onChange={item => this.setState({ inlineItem: item })}
            errors={Immutable.Map()}
            {...formProps} />
        <div>
          <button
              onClick={this.handleSave}
              className="btn btn-primary">
            Save
          </button>
          <button
              className="btn btn-danger"
              onClick={() => this.setState({ inlineItem: null })}>
            Cancel
          </button>
        </div>
      </div>
    )
  },

  renderEmptyResults() {
    var { type } = this.props
      , { searchedText, inlineItem } = this.state

    // TODO: Check response for _links indicating add permission and URL
    // instead of building the URL manually

    return inlineItem ? this.renderInlineAddForm() : (
      <div>
        <p>
          <em>No results for { type } "{ searchedText }"</em>
        </p>
        <p>
          <button
            className="btn btn-primary"
            onClick={this.handleAddReference.bind(null, type)}>
            Add new { type }
          </button>
        </p>
      </div>
    )
  },

  handleSelect(item, e) {
    var { onSelect } = this.props

    if (e) e.preventDefault();

    onSelect(item);
  },

  renderResultItem(result, i) {
    var { type } = this.props
      , anchorOpts = { onClick: this.handleSelect.bind(null, result), href: '#' }
      , anchor

    if (type === 'document') {
      anchorOpts.dangerouslySetInnerHTML = { __html: result.get('description') }
      anchor = <a {...anchorOpts} />
    } else {
      let text = result.get(type === 'topic' ? 'preferred_name' : 'title')

      anchor = <a {...anchorOpts}>{ text }</a>
    }

    return <li key={i}>{ anchor }</li>
  },

  renderResultList() {
    var { matchCount, matchResults, searchedText } = this.state

    return (
      <div>
        <p>
          <em>{ matchCount } matches for { searchedText }</em>
        </p>
        <ul>
          { matchResults.map(this.renderResultItem) }
        </ul>
      </div>
    )
  },

  renderMatchResults() {
    var { matchResults } = this.state

    return matchResults.size === 0 ?
      this.renderEmptyResults() :
      this.renderResultList()
  },


  render() {
    var Spinner = require('../spinner/component.jsx')
      , { type } = this.props
      , { searchText, matchResults, inlineItem } = this.state
      , show = type && type !== 'empty'

    return (
      <div>
        <h3><Translate text={TEXT.referencesHeader} /></h3>

        {
          type === 'empty' && (
            <p><Translate text={TEXT.referenceHint} /></p>
          )
        }

        <div className={ show ? '' : 'hide' }>
          <label className={ inlineItem ? 'hide' : '' }>

          {
            show && (
              <strong>
                <Translate text={TEXT[`find${type}`]} />
              </strong>
            )
          }

            <br />

            <input
                type="text"
                ref="autocomplete"
                value={searchText}
                onChange={this.handleAutocompleteChange} />
            <Spinner spin={this.state.fetching} />
          </label>

          { matchResults && this.renderMatchResults() }
        </div>
      </div>
    )
  }
});
