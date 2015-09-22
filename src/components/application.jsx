"use strict";

var _ = require('underscore')
  , React = require('react')
  , { DragDropContext } = require('react-dnd')
  , HTML5Backend = require('react-dnd/modules/backends/HTML5')
  , Application

Application = React.createClass({
  displayName: 'EditorsNotesApplication',

  getInitialState() {
    return { loading: false }
  },

  componentDidMount() {
    window.EditorsNotes.events.on('loadstart', () => this.setState({ loading: true }));
    window.EditorsNotes.events.on('loadstop', () => this.setState({ loading: false }));
  },

  render: function () {
    var Header = require('./main/header/component.jsx')
      , Footer = require('./main/footer/component.jsx')
      , ActiveComponent = this.props.ActiveComponent
      , user = this.props.__AUTHENTICATED_USER__ || null
      , activeComponentProps

    activeComponentProps = _.omit(this.props, ['ActiveComponent', '__AUTHENTICATED_USER__']);
    activeComponentProps.user = user;

    return (
      <div style={{ height: '100%' }}>
        <div className="main-wrapper">
          <Header user={user} loading={this.state.loading} />

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
