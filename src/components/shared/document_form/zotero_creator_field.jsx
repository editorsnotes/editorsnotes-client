"use strict";

var React = require('react')
  , Immutable = require('immutable')


const CREATOR_TYPES = {
  firstName: 'Given name',
  lastName: 'Family name',
  name: 'Name'
}


module.exports = React.createClass({
  displayName: 'ZoteroCreator',

  propTypes: {
    creator: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    creatorTypes: React.PropTypes.instanceOf(Immutable.List),

    handleCreatorAdd: React.PropTypes.func.isRequired,
    handleCreatorRemove: React.PropTypes.func.isRequired,
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
    var { creator, handleCreatorAdd, handleCreatorRemove } = this.props
      , creatorFields

    creatorFields = creator
      .delete('creatorType')
      .map((val, field) => [field, val])
      .toList()
      .sortBy(([field]) => field)
      .toList()

    return (
      <div className="ZoteroField mb1 flex flex-center">
        <select
            className="flex-none"
            value={creator.get('creatorType')}
            onChange={this.handleChange.bind(null, 'creatorType')}>
          { this.renderCreatorOptions() }
        </select>

        <div className="flex-grow flex">
          {
            creatorFields.map(([field, value]) =>
              <input
                  key={field}
                  type="text"
                  placeholder={this.translate(CREATOR_TYPES[field])}
                  className="field mr1 flex-auto"
                  value={value}
                  onChange={this.handleChange.bind(null, field)} />
            )
          }

          <button
              style={{ flexBasis: 'auto' }}
              className="btn btn-outline btn-small mr1 flex-none"
              onClick={handleCreatorAdd.bind(null, creator)}>
            +
          </button>
          <button
              style={{ flexBasis: 'auto' }}
              className="btn btn-outline btn-small flex-none"
              onClick={handleCreatorRemove.bind(null, creator)}>
            -
          </button>
        </div>

      </div>
    )
  }
});
