"use strict";

var _ = require('underscore')
  , React = require('react')
  , { DragDropContext } = require('react-dnd')
  , HTML5Backend = require('react-dnd/modules/backends/HTML5')
  , Application

Application = React.createClass({
  displayName: 'EditorsNotesApplication',
  render: function () {
    var Header = require('../header/component.jsx')
      , Footer = require('../footer/component.jsx')
      , ActiveComponent = this.props.ActiveComponent
      , user = this.props.__AUTHENTICATED_USER__ || null
      , activeComponentProps

    activeComponentProps = _.omit(this.props, ['ActiveComponent', '__AUTHENTICATED_USER__']);
    activeComponentProps.user = user;

    return (
      <div style={{ height: '100%' }}>
        <div className="main-wrapper">
          <Header user={user} />

          <div data-fixme="main-wrap" className="container">
            {/* FIXME: messages

            {% if messages %}
            <div id="message-list" class="container">
              {% for message in messages %}
              <div class="alert {% if message.tags %} alert-{{ message.tags }}{% endif %}">
                {{ message|safe }}
              </div>
              {% endfor %}
            </div>
            {% endif %}

            */}

            <div data-fixme="main">
              {/* Main application*/}
              <ActiveComponent {...activeComponentProps} />
            </div>
            <div className="push" />
          </div>

        </div>
        <Footer />
      </div>
    )
  }
});

module.exports = DragDropContext(HTML5Backend)(Application);
