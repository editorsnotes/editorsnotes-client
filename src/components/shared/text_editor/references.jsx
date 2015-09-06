"use strict";

/* eslint camelcase:0 */

var _ = require('underscore')
  , React = require('react')
  , Immutable = require('immutable')


const TEXT = {
  referencesHeader: 'References',
  referenceHint: "Type 'd' for document, 'n' for note, or 't' for topic.",
  findnote: "Find note",
  findtopic: "Find topic",
  finddocument: "Find document",

}

const FORM_COMPONENTS = {
  note: require('../note_form.jsx'),
  topic: require('../topic_form.jsx')
}



function makeItem(type, text) {
  var Note = require('../../../records/note')
    , Topic = require('../../../records/topic')
    , Document = null

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
    type: React.PropTypes.oneOf([null, 'empty', 'note', 'topic', 'document']).isRequired,
    onSelect: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      searchText: '',

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
      , opts

    opts = {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    }

    this.resetSearchResults();

    fetch(listURL, opts)
      .then(response => response.json())
      .then(Immutable.fromJS)
      .then(data => {
        if (searchText !== this.state.searchText) return;

        this.setState({
          matchResults: data.results,
          matchCount: data.count,
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

  renderInlineAddForm() {
    var { type, projectURL } = this.props
      , { inlineItem } = this.state
      , Form = FORM_COMPONENTS[type]
      , formProps = { [type]: inlineItem }

    return (
      <div>
        <Form
            projectURL={projectURL}
            minimal={true}
            onChange={item => this.setState({ inlineItem: item })}
            {...formProps} />
        <div>
          <button className="btn btn-primary">Save</button>
          <button className="btn btn-danger">Cancel</button>
        </div>
      </div>
    )
  },

  renderEmptyResults() {
    var { type } = this.props
      , { searchedText, inlineItem } = this.state

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

  renderResultList() {
    var { matchCount, matchResults, searchedText } = this.state

    return (
      <div>
        <p>
          <em>{ matchCount } matches for { searchedText }</em>
        </p>
        <ul>
          {
            matchResults.map((result, i) =>
              <li key={i}>{ result.get('title') }</li>
            )
          }
        </ul>
      </div>
    )
  },

  renderMatchResults() {
    var { matchResults } = this.state

    return matchResults.length === 0 ?
      this.renderEmptyResults() :
      this.renderResultList()
  },


  render() {
    var Translate = require('../translate.jsx')
      , { type } = this.props
      , { searchText, matchResults } = this.state
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
          <label>

            <strong>
              <Translate text={TEXT[`find${type}`]} />
            </strong>

            <br />

            <input
                type="text"
                ref="autocomplete"
                value={searchText}
                onChange={this.handleChange} />
          </label>

          { matchResults && this.renderMatchResults() }
        </div>
      </div>
    )
  }
});
