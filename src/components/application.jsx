"use strict";

var _ = require('underscore')
  , React = require('react')
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
    var classnames = require('classnames')
      , Header = require('./main/header/component.jsx')
      , Footer = require('./main/footer/component.jsx')
      , { ActiveComponent, noContainer, noFooter, path } = this.props
      , { loading } = this.state
      , user = this.props.__AUTHENTICATED_USER__ || null
      , activeComponentProps

    activeComponentProps = _.omit(this.props, ['ActiveComponent', '__AUTHENTICATED_USER__']);
    activeComponentProps.user = user;

    return (
      <div className="flex flex-column" style={{ minHeight: '100vh' }}>
        <Header
            user={user}
            path={path}
            loading={loading}
            noContainer={noContainer} />
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

        <main className="flex-grow relative">
          <div className={classnames({ container: !noContainer })}>
            <ActiveComponent {...activeComponentProps} />
          </div>
        </main>

        { !noFooter && <Footer /> }
      </div>
    )
  }
});

module.exports = Application;
