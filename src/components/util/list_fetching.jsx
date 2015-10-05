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

    onFetchFinish(searchedText, resp) {
      var handleResponse = require('../../utils/handle_response')
        , { lastSearchedText } = this.state

      if (searchedText !== lastSearchedText) return null

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

    // FIXME: Better handlin'
    handleError(e) {
      throw e;
    },

    fetchList(listURL, query, params={}) {
      var formattedURL = this.buildURL(listURL, query, params)
        , onFetchFinish = this.onFetchFinish.bind(null, query)
        , opts

      opts = {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      }

      this.setState({
        listResultsLoading: true,
        lastSearchedText: query
      });

      fetch(formattedURL, opts)
        .then(onFetchFinish, onFetchFinish)
        .then(response => {
          return response && response.json()
            .then(Immutable.fromJS)
            .then(data => this.setState({
                listResults: data,
                listResultsText: query,
                lastSearchedText: null
            }))
        })
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
