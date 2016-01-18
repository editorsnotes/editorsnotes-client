"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'RelatedTopicSelector',

  propTypes: {
    topics: React.PropTypes.instanceOf(Immutable.Set).isRequired,
    projectURL: React.PropTypes.string.isRequired,
  },

  renderOption(item) {
    var { getDisplayTitle } = require('../../../helpers/api')

    return getDisplayTitle(item);
  },

  getOptions(q) {
    var url = require('url')
      , apiFetch = require('../../../utils/api_fetch')
      , { projectURL } = this.props

    return apiFetch(url.format({
        pathname: projectURL + 'topics/',
        query: q.length === 0 ? undefined : { q }
      }))
      .then(resp => resp.json())
      .then(Immutable.fromJS)
      .then(data => {
        return { options: data.get('results').toArray() }
      });
  },

  render: function () {
    var Select = require('react-select')
      , { topics, onChange } = this.props

    return (
      <Select.Async
          minimumInput={1}
          multi={true}
          name={"select-thing"}
          className="mb1"
          value={topics.toArray()}
          cache={null}
          placeholder=<strong>Related topics</strong>
          filterOptions={opts => opts}
          loadOptions={this.getOptions}
          optionRenderer={this.renderOption}
          valueRenderer={this.renderOption}
          onChange={onChange} />
    )
  }
});
