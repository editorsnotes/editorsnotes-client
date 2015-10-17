"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../shared/translate.jsx')
  , editableComponent = require('./editable_component.jsx')
  , commonStrings = require('../common_strings')

module.exports = function (Component, type) {
  var StandaloneForm = React.createClass({
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

    isNew() {
      return !this.props.data
    },

    getProjectURL() {
      return this.isNew() ?
        this.props.project.get('url') :
        this.props.data.get('project')
    },

    handleSaveSuccess(response) {
      var redirect = this.isNew() ?
        response.headers.get('Location') :
        this.props.data.get('url')

      window.location.href = redirect;
    },

    saveAndRedirect(data) {
      var { save } = this.props
        , id = this.isNew() ? null : this.props.data.get('id')

      save(id, this.getProjectURL(), data).then(this.handleSaveSuccess);
    },

    render() {
      return (
        <div>
          { this.renderBreadcrumb() }

          <Component
              {...this.props}
              projectURL={this.getProjectURL()}
              saveAndRedirect={this.saveAndRedirect} />

        </div>
      )
    }
  });

  return editableComponent(StandaloneForm, type)
}
