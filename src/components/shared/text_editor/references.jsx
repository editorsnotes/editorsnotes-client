"use strict";

/* eslint camelcase:0 */

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../translate.jsx')
  , strings = require('./strings')


module.exports = React.createClass({
  displayName: 'ReferenceHint',

  propTypes: {
    type: React.PropTypes.oneOf([null, 'empty', 'note', 'topic', 'document']),
    projectURL: React.PropTypes.string.isRequired,

    embeddedItems: React.PropTypes.instanceOf(Immutable.Set).isRequired,

    onSelect: React.PropTypes.func.isRequired,
    onAddEmbeddedItem: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return { addingInlineItem: null }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.type !== this.props.type) {
      this.setState({ addingInlineItem: null });
    }
  },

  handleSelect(item, e) {
    var { onSelect } = this.props

    if (e) e.preventDefault();

    onSelect(item);
  },

  renderReferencesList() {
    var { getType, getDisplayTitle } = require('../../../helpers/api')
      , { embeddedItems } = this.props

    return (
      <ul className="list-reset">
      {
        embeddedItems.map(item =>
          <li key={item.get('url')}>
            <strong>{ getType(item) }: </strong>
            { getDisplayTitle(item) }
          </li>
        )
      }
      </ul>
    )
  },

  renderReferenceHint() {
    return <p><Translate text={strings.referenceHint} /></p>
  },

  renderReferenceSearch() {
    var ReferenceSearch = require('./reference_search.jsx')
      , AddInlineItem = require('./add_inline_item.jsx')
      , { type, projectURL } = this.props
      , { addingInlineItem } = this.state

    return (
      <div>
        <div className={addingInlineItem !== null ? 'hide' : ''}>
          <ReferenceSearch
              onSelect={this.handleSelect}
              onClickAddInline={text => this.setState({ addingInlineItem: text })}
              type={type}
              projectURL={projectURL} />
        </div>

        { addingInlineItem !== null && (
          <AddInlineItem
              onSelect={this.handleSelect}
              onCancel={() => this.setState({ addingInlineItem: null })}
              type={type}
              projectURL={projectURL}
              initialText={addingInlineItem} />
        )}
      </div>
    )
  },

  render() {
    var { type } = this.props
      , show = type && type !== 'empty'

    return (
      <div>
        <h3 className="m0"><Translate text={strings.referencesHeader} /></h3>

        { !type && this.renderReferencesList() }
        { type === 'empty' && this.renderReferenceHint() }
        { show && this.renderReferenceSearch() }
      </div>
    )
  }
});
