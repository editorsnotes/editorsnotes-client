"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../shared/translate.jsx')
  , commonStrings = require('../common_strings')

module.exports = function (Component, type) {
  var EditingBreadcrumb = React.createClass({
    getItemLabel() {
      var { data } = this.props

      if (type === 'note') {
        return data.get('title');
      } else if (type === 'topic') {
        return data.get('preferred_name');
      } else if (type === 'document') {
        return data.get('description')
      } else {
        throw TypeError();
      }
    },

    renderBreadcrumb() {
      var Breadcrumb = require('../shared/breadcrumb/component.jsx')
        , { getEmbedded } = require('../../helpers/api')
        , { data } = this.props
        , project = this.props.project || getEmbedded(data, 'project')
        , crumbs

      crumbs = Immutable.List([
        Immutable.Map({ href: project.get('url'), label: project.get('name') }),
        Immutable.Map({
          href: project.get('url') + `${type}s/`,
          label: <Translate text={commonStrings[type]} number={1} />
        })
      ]);

      crumbs = crumbs.concat(Immutable.List(
        !data ?
          [ Immutable.Map({ label: <Translate text={commonStrings.add} /> }) ] :
          [
            Immutable.Map({ href: data.get('url'), label: this.getItemLabel() }),
            Immutable.Map({ label: <Translate text={commonStrings.edit} /> })
          ]
      ));

      return <Breadcrumb crumbs={crumbs} />
    },

    render() {
      return (
        <Component
            {...this.props}
            renderBreadcrumb={this.renderBreadcrumb} />
      )
    }
  });

  return EditingBreadcrumb;
}
