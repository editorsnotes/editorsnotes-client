"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'ZoteroCreator',

  propTypes: {
    creator: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    creatorTypes: React.PropTypes.instanceOf(Immutable.List),
    onCreatorChange: React.PropTypes.func.isRequired
  },

  translate(value) {
    var { jed } = global.EditorsNotes

    return jed
      .translate(value)
      .onDomain('messages_zotero')
      .fetch()
  },

  renderCreatorOptions() {
    var { creator, creatorTypes } = this.props
      , creatorTypesList

    creatorTypesList = creatorTypes || Immutable.fromJS([{
      creatorType: creator.get('creatorType')
    }]);

    return creatorTypesList.map(type =>
      <option key={type.get('creatorType')} value={type.get('creatorType')}>
        { this.translate(type.get('creatorType')) }
      </option>
    )
  },

  handleChange(field, e) {
    var { creator, onCreatorChange } = this.props

    onCreatorChange(creator.set(field, e.target.value));
  },

  render() {
    var { creator } = this.props
      , creatorFields

    creatorFields = creator
      .delete('creatorType')
      .map((val, field) => [field, val])
      .toList()
      .sortBy(([field]) => field)

    return (
      <div className="zotero-row">
        <select
            value={creator.get('creatorType')}
            onChange={this.handleChange.bind(null, 'creatorType')}>
          { this.renderCreatorOptions() }
        </select>

        {
          creatorFields.map(([field, value]) =>
            <input
                key={field}
                type="text"
                placeholder={this.translate(field)}
                className="field"
                value={value}
                onChange={this.handleChange.bind(null, field)} />
          ).toList()
        }

      </div>
    )
  }
});
