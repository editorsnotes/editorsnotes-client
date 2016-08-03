"use strict";

const React = require('react')
    , Immutable = require('immutable')
    , Jed = require('jed')
    , { connect } = require('react-redux')


const CREATOR_TYPES = {
  firstName: 'Given name',
  lastName: 'Family name',
  name: 'Name'
}

function mapStateToProps(state) {
  return {
    jed: state.get('jed')
  }
}


const ZoteroCreator = React.createClass({
  propTypes: {
    jed: React.PropTypes.instanceOf(Jed).isRequired,
    creator: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    creatorTypes: React.PropTypes.instanceOf(Immutable.List),

    handleCreatorAdd: React.PropTypes.func.isRequired,
    handleCreatorRemove: React.PropTypes.func.isRequired,
    onCreatorChange: React.PropTypes.func.isRequired
  },

  translate(value) {
    const { jed } = this.props

    return jed
      .translate(value)
      .onDomain('messages_zotero')
      .fetch()
  },

  renderCreatorOptions() {
    const { creator, creatorTypes } = this.props

    const creatorTypesList = creatorTypes || Immutable.fromJS([{
      creatorType: creator.get('creatorType')
    }]);

    return creatorTypesList.map(type =>
      <option key={type.get('creatorType')} value={type.get('creatorType')}>
        { this.translate(type.get('creatorType')) }
      </option>
    )
  },

  handleChange(field, e) {
    const { creator, onCreatorChange } = this.props

    onCreatorChange(creator.set(field, e.target.value));
  },

  render() {
    const { creator, handleCreatorAdd, handleCreatorRemove } = this.props

    const creatorFields = creator
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

module.exports = connect(mapStateToProps)(ZoteroCreator);
