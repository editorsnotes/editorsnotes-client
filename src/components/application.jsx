"use strict";

var React = require('react')

module.exports = React.createClass({
  render: function () {
    var Header = require('./header.jsx')
      , Footer = require('./footer.jsx')

    return (
      <div style={{ height: '100%' }}>
        <div className="main-wrapper">
          <Header />

          <div data-fixme="main-wrap" className="container">
            {/*
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
            </div>
            <div className="push" />
          </div>

        </div>
        <Footer />
      </div>
    )
  }
});
