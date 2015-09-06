"use strict";

var _ = require('underscore')
  , React = require('react')
  , Immutable = require('immutable')

const FORM_COMPONENTS = {
  note: require('../note_form.jsx'),
  topic: require('../topic_form.jsx')
}

module.exports = React.createClass({
  displayName: 'TextEditor',

  propTypes: {
    projectURL: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      html: '',
      style: {}
    }
  },

  getInitialState() {
    return {
      editor: null,
      referenceHint: null,
      referenceSearch: '',
      matchingReferences: null,
      matchCount: null,
      searchedText: null,
      addReferenceComponent: null
    }
  },

  componentWillMount() {
    this.fetchMatchingReferences = _.debounce(this.fetchMatchingReferences, 250);
  },

  onAddEmptyReference(type) {
    this.setState({ referenceHint: type || 'empty' });
    this.state.editor.on('beforeChange', this.clearReferenceHint);

    if (type) {
      React.findDOMNode(this.refs.autocomplete).focus();
    }
  },

  handleReferenceChange(e) {
    var callback = e.target.value ?
      this.fetchMatchingReferences :
      this.resetSearchResults

    this.setState({ referenceSearch: e.target.value }, callback);
  },

  resetSearchResults() {
    this.setState({
      matchingReferences: null,
      matchCount: null,
      searchedText: null
    });
  },

  clearReferenceHint() {
    this.setState({
      referenceHint: null,
      referenceSearch: '',
    });
    this.resetSearchResults()
    this.state.editor.off('beforeChange', this.clearReferenceHint);
  },

  handleAddReference(type) {
    var Component = FORM_COMPONENTS[type]
      , addReferenceComponent

    addReferenceComponent = (
      <Component
          projectURL={this.props.projectURL}
          minimal={true} />
    )

    this.setState({ addReferenceComponent })
  },

  fetchMatchingReferences() {
    var type = this.state.referenceHint
      , searchedText = this.state.referenceSearch
      , listURL = `${this.props.projectURL}${type}s/?q=${searchedText}`
      , opts

    opts = {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    }

    this.resetSearchResults();

    fetch(listURL, opts)
      .then(response => response.json())
      .then(data => {
        if (searchedText !== this.state.referenceSearch) return;


        this.setState({
          matchingReferences: data.results,
          matchCount: data.count,
          searchedText
        })
      })
  },

  componentDidMount() {
    var codemirrorEditor = require('./editor')
      , el = React.findDOMNode(this.refs.content)
      , editor

    editor = codemirrorEditor(el, this.props.html, {
      handleAddReference: this.onAddEmptyReference
    });

    editor.display.wrapper.style.fontFamily = '"Times New Roman"';
    editor.display.wrapper.style.fontSize = '16px';
    editor.display.wrapper.style.height = 'auto';
    editor.display.wrapper.style.border = '1px solid #ccc';
    editor.display.wrapper.style.padding = '1em';

    editor.display.scroller.style.minHeight = '360px';

    editor.refresh();

    editor.on('change', () => this.props.onChange(editor.getValue()));

    this.setState({ editor });
  },

  renderMatchingReferences() {
    return this.state.matchingReferences.length === 0 ?
      <div>
        <p><em>No results for { this.state.referenceHint } "{ this.state.searchedText }"</em></p>
        <p>
          <button
            className="btn btn-primary"
            onClick={this.handleAddReference.bind(null, this.state.referenceHint)}>
            Add new { this.state.referenceHint }
          </button>
          { this.state.addReferenceComponent }
        </p>
      </div> :
      <div>
        <p><em>{ this.state.matchCount } matches for { this.state.searchedText }</em></p>
        <ul>
          {
            this.state.matchingReferences.map(result => <li>{ result.title }</li> )
          }
        </ul>
      </div>
  },

  render() {
    var hint = this.state.referenceHint
      , showHintLabel = hint && hint !== 'empty'

    return (
      <div className="row">
        <div className="span7">
          <div ref="content" />
        </div>
        <div className="span5">
          <h3>References</h3>
          <div>
            {
              hint === 'empty' && (
                <p>Type 'd' for document, 'n' for note, or 't' for topic</p>
              )
            }

            <div className={showHintLabel ? '' : 'hide'}>
              <label>
                <strong>Find { this.state.referenceHint }</strong>
                <br />
                <input
                  type="text"
                  ref="autocomplete"
                  value={this.state.referenceSearch}
                  onChange={this.handleReferenceChange} />
              </label>

              { this.state.matchingReferences && this.renderMatchingReferences() }
            </div>

          </div>
        </div>
      </div>
    )
  }
});
