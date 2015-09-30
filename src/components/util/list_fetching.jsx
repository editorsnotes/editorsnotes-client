"use strict";

var _ = require('underscore')
  , React = require('react')
  , Immutable = require('immutable')
  , url = require('url')

module.exports = function makeListFetchingComponent(Component, pause=250) {
  var ListFetchingComponent = React.createClass({
    getInitialState() {
      return {
        listResults: null,
        listResultsText: null,
        listResultsLoading: false,

        /* For internal use only: keeping track of last request sent */
        lastSearchedText: null
      }
    },

    componentWillMount() {
      this.fetchList = _.debounce(this.fetchList, pause)
    },

    onFetchFinish(resp, searchedText) {
      var handleResponse = require('../../utils/handle_response')

      if (searchedText !== this.state.lastSearchedText) return null

      this.setState({ listResultsLoading: false });

      if (resp instanceof Error) {
        throw resp;
      } else {
        return handleResponse(resp);
      }
    },

    buildURL(listURL, text, params={}) {
      var parsed = url.parse(listURL, true)

      parsed.query = _.extend(parsed.query, params)

      if (text) parsed.query.q = text;

      return url.format(parsed);
    },

    fetchList(listURL, query, params={}) {
      var formattedURL = this.buildURL(listURL, query, params)
        , onFetchFinish = this.onFetchFinish.bind(null, query)
        , opts

      opts = {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      }

      this.resetSearchResults();

      this.setState({
        listResultsLoading: true,
        lastSearchedText: query
      });

      fetch(formattedURL, opts)
        .then(onFetchFinish, onFetchFinish)
        .then(response => response && (
          response.json()
            .then(Immutable.fromJS)
            .then(data => this.setState({
                listResults: data,
                lastSearchedText: null
            }))
        ))
        .catch(this.handleError)
    },

    render() {
      return (
        <Component
            {...this.props}
            {...this.state}
            lastSearchedText={undefined}
            fetchList={this.fetchList} />
      )
    }
  });

  return ListFetchingComponent;
}
