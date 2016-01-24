"use strict";

var React = require('react')
  , Immutable = require('immutable')

function getOptions(projectURL, q) {
  var url = require('url')
    , apiFetch = require('../../../utils/api_fetch')

  return apiFetch(url.format({
      pathname: projectURL + 'topics/',
      query: q.length === 0 ? undefined : { q }
    }))
    .then(resp => resp.json())
    .then(Immutable.fromJS)
    .then(data => ({ options: data.get('results').toArray() }));
}

function RelatedTopicsSelector({ topics, projectURL, onChange }) {
  var Select = require('react-select')
    , { getDisplayTitle } = require('../../../helpers/api')

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
        loadOptions={query => getOptions(projectURL, query)}
        optionRenderer={getDisplayTitle}
        valueRenderer={getDisplayTitle}
        onChange={onChange} />
  )
}

RelatedTopicsSelector.propTypes = {
  topics: React.PropTypes.instanceOf(Immutable.Set).isRequired,
  projectURL: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired
}

module.exports = RelatedTopicsSelector;
