"use strict";

var React = require('react')
  , editableComponent = require('./editable_component.jsx')

module.exports = function (Component, type) {
  var StandaloneForm = React.createClass({
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
        <Component
            {...this.props}
            projectURL={this.getProjectURL()}
            saveAndRedirect={this.saveAndRedirect} />
      )
    }
  });

  return editableComponent(StandaloneForm, type)
}
