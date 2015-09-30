"use strict";

/* eslint camelcase:0 */

var React = require('react')
  , Translate = require('../translate.jsx')
  , strings = require('./strings')


module.exports = React.createClass({
  displayName: 'ReferenceHint',

  propTypes: {
    type: React.PropTypes.oneOf([null, 'empty', 'note', 'topic', 'document']),
    projectURL: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired,
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

  render() {
    var ReferenceSearch = require('./reference_search.jsx')
      , AddInlineItem = require('./add_inline_item.jsx')
      , { type, projectURL } = this.props
      , { addingInlineItem } = this.state
      , show = type && type !== 'empty'

    return (
      <div>
        <h3><Translate text={strings.referencesHeader} /></h3>

        { type === 'empty' && <p><Translate text={strings.referenceHint} /></p> }

        { show && (
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
        )}
      </div>
    )
  }
});
