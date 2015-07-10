"use strict";

var _ = require('underscore')
  , React = require('react')
  , { DragDropContext } = require('react-dnd')
  , HTML5Backend = require('react-dnd/modules/backends/HTML5')
  , Application

Application = React.createClass({
  displayName: 'EditorsNotesApplication',
  getInitialState: function () {
    return { user: null }
  },
  componentDidMount: function () {
    this.checkForUser();
  },
  checkForUser: function () {
    var cookie = require('cookie-cutter')
      , user = localStorage.userInfo
      , authCookie = cookie.get('token')

    if (user && authCookie) {
      user = JSON.parse(user);
      this.setState({ user });
    }
  },
  render: function () {
    var Header = require('./header.jsx')
      , Footer = require('./footer.jsx')
      , ActiveComponent = this.props.ActiveComponent
      , activeComponentProps

    activeComponentProps = _.omit(this.props, ['ActiveComponent'])

    return (
      <div style={{ height: '100%' }}>
        <div className="main-wrapper">
          <Header user={this.state.user} />

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
