"use strict";

/* eslint camelcase:0 */

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../translate.jsx')
  , commonStrings = require('../../common_strings')
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
    return {
      addingInlineItem: null,
      shownTab: 'references'
    }
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
            <strong
                className="inline-block right-align mr1"
                style={{ width: '76px' }}>
              { getType(item) }:
            </strong>
            <a
                href={item.get('url')}
                target="blank"
                className="inline inline-children"
                dangerouslySetInnerHTML={{  __html: getDisplayTitle(item) }} />
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
    var classnames = require('classnames')
      , { type } = this.props
      , { shownTab } = this.state
      , show = type && type !== 'empty'
      , tabclass = 'm0 inline-block border border-box col-6 p2 center'

    return (
      <div className="flex flex-column" style={{ maxHeight: '90vh' }}>
        <div style={{ cursor: 'pointer', marginBottom: '2px' }}>
          <h3
              onClick={() => this.setState({ shownTab: 'references' })}
              className={classnames(tabclass, {
                'bg-red': shownTab === 'references'
              })}>
            <Translate text={strings.referencesHeader} />
          </h3>
          <h3
              onClick={() => this.setState({ shownTab: 'help' })}
              className={classnames(tabclass, {
                'bg-red': shownTab === 'help'
              })}>
            <Translate text={commonStrings.help} />
          </h3>
        </div>

        <div className="flex-auto py2 px3" style={{ overflowY: 'auto' }}>
          {
            shownTab === 'references' && (
              <div>
                { !type && this.renderReferencesList() }
                { type === 'empty' && this.renderReferenceHint() }
                { show && this.renderReferenceSearch() }
              </div>
            )
          }

        </div>
      </div>
    )
  }
});
