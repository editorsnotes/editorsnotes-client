"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , url = require('url')

const ZOTERO_API_URL = 'https://api.zotero.org'

function fetchZoteroJSON(pathname, query={}) {
  var zoteroURL = ZOTERO_API_URL + url.format({ pathname, query })

  return fetch(zoteroURL, { headers: { Accept: 'application/json' }})
    .then(response => response.text())
    .then(text => {
      var keys = []
        , data

      data = Immutable.fromJS(JSON.parse(text, (k, v) => {
        if (!(/\d/.test(k))) keys.push(k);
        return v;
      }));

      return data instanceof Immutable.Map ?
        data.sortBy((v, k) => keys.indexOf(k)) :
        data
    })
}


module.exports = function (Component) {
  var ZoteroFetching = React.createClass({
    propTypes: {
    },

    getInitialState() {
      return {
        itemTypes: null,
        itemTemplate: null,
        creatorTypes: null,

        loadingTemplate: false,
        loadingItemTypes: false
      }
    },

    componentDidMount() {
      var { data } = this.props

      this.fetchItemTypes();

      if (data && data.has('itemType')) {
        this.fetchItemTemplates(data.get('itemType'));
      }
    },

    fetchItemTypes() {
      var pass = require('../../../utils/pass')
        , notLoading = pass(() => this.setState({ loadingItemTypes: false }))

      this.setState({ loadingItemTypes: true });

      return fetchZoteroJSON('/itemTypes')
        .then(notLoading, notLoading)
        .then(itemTypes => this.setState({ itemTypes }))

    },

    mergeDataWithTemplate(template) {
      var { data } = this.props
        , { creatorTypes } = this.state

      if (!data) return template

      creatorTypes = creatorTypes.map(type => type.get('creatorType')).toSet();

      return template.withMutations(updatedData => {
        updatedData.forEach((val, key) => {
          if (key === 'creators') {
            let savedCreators = data
              .get('creators')
              .filter(creator => (
                creatorTypes.contains(creator.get('creatorTypes'))))
              .filter(creator => (
                creator.get('name') ||
                creator.get('lastName') ||
                creator.get('firstName')))

            if (savedCreators.size) {
              updatedData.set('creators', savedCreators);
            }
          } else if (data.has(key) && key !== 'itemType') {
            updatedData.set(key, data.get(key));
          }
        })
      });
    },

    fetchItemTemplates(itemType) {
      var pass = require('../../../utils/pass')
        , { onValueChange } = this.props
        , notLoading = pass(() => this.setState({ loadingTemplate: false }))

      this.setState({ loadingTemplate: true });

      return new Promise((resolve, reject) => {
        var itemTemplateP = fetchZoteroJSON('/items/new', { itemType })
          , creatorTypesP = fetchZoteroJSON('/itemTypeCreatorTypes', { itemType })

        Promise.all([itemTemplateP, creatorTypesP])
          .then(notLoading, notLoading)
          .then(
            ([itemTemplate, creatorTypes]) => (
              this.setState({ creatorTypes }, () => {
                onValueChange(this.mergeDataWithTemplate(itemTemplate));
                resolve()
              })
            ),
            reject
          )
      })
    },

    render() {
      return (
        <Component
            {...this.props}
            {...this.state}
            fetchItemTemplates={this.fetchItemTemplates} />
      )
    }
  });

  return ZoteroFetching;
}
