"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , ListFetching = require('../../util/list_fetching.jsx')
  , Translate = require('../translate.jsx')
  , strings = require('./strings')
  , ReferenceSearch

ReferenceSearch = React.createClass({
  propTypes: {
    onSelect: React.PropTypes.func.isRequired,
    onClickAddInline: React.PropTypes.func.isRequired,
    projectURL: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,

    /* provided by ListFetching */
    fetchList: React.PropTypes.func.isRequired,
    listResultsLoading: React.PropTypes.bool.isRequired,
    listResults: React.PropTypes.instanceOf(Immutable.Map),
    listResultsText: React.PropTypes.string
  },

  getInitialState() {
    return { searchText: '' }
  },

  componentDidMount() {
    React.findDOMNode(this.refs.searchInput).focus()
  },
    /*
  fetchMatchingReferences() {
    var { type, projectURL } = this.props
      , { searchText } = this.state
      , listURL = `${projectURL}${type}s/?q=${searchText}`
      , stopSpinner = resp => { this.setState({ fetching: false }); return resp }
      , opts
      */

  handleAutocompleteChange(e) {
    var searchText = e.target.value
      , { type, projectURL, fetchList } = this.props

    this.setState({ searchText });

    if (searchText) fetchList(`${projectURL}${type}s/`, searchText);
  },

  renderAddInlineButton() {
    var { onClickAddInline, type } = this.props
      , { searchText } = this.state

    return (
      <p>
        <button
          className="btn btn-primary"
          onClick={() => onClickAddInline(searchText)}>
          Add new { type }
        </button>
      </p>
    )
  },

  renderEmptyResults() {
    var { type, listResultsText } = this.props

    // FIXME: localize
    return (
      <p>
        <em>No results for { type } "{ listResultsText }"</em>
      </p>
    )
  },

  renderListItem(result) {
    var { type, onSelect } = this.props
      , anchorOpts = { onClick: onSelect.bind(null, result), href: '' }
      , anchor

    if (type === 'document') {
      anchorOpts.dangerouslySetInnerHTML = { __html: result.get('description') }
      anchor = <a {...anchorOpts} />
    } else {
      let text = result.get(type === 'topic' ? 'preferred_name' : 'title')

      anchor = <a {...anchorOpts}>{ text }</a>
    }

    return <li key={result.get('id')}>{ anchor }</li>
  },

  renderListResults() {
    var { listResults, listResultsText } = this.props

    return (
      <div>
        <p>
          <em>{ listResults.get('count') } matches for { listResultsText }</em>
        </p>
        <ul>{ listResults.get('results').map(this.renderListItem) }</ul>
      </div>
    )
  },

  render() {
    var Spinner = require('../spinner/component.jsx')
      , { type, listResultsLoading, listResults } = this.props
      , { searchText } = this.state

    return (
      <div>
        <strong><Translate text={strings[`find${type}`]} /></strong>

        <br />

        <input
            type="text"
            ref="searchInput"
            value={searchText}
            onChange={this.handleAutocompleteChange} />

        <Spinner spin={listResultsLoading} />

        {
          searchText && listResults && (
            <div>
              {
                listResults.get('count') === 0 ?
                  this.renderEmptyResults() :
                  this.renderListResults()
              }

              { this.renderAddInlineButton() }
            </div>
          )
        }

      </div>
    )
  }
});

module.exports = ListFetching(ReferenceSearch);
