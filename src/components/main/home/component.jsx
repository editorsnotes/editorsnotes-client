"use strict";

var React = require('react')
  , UserHomepage

UserHomepage = React.createClass({
  render: function () {
    var { user } = this.props
    return (
      <div className="row">
        <div className="span6">
          <a href="/auth/account/">Account settings</a>

          <hr />

          <div>
            { this.props.user.get('project_roles').map((role, i) =>
                <div key={i}>
                  { role.get('project') }
                  <ul>
                    <li>
                      <a href={ role.get('project_url') + 'notes/add/' }>
                      Add note
                      </a>
                    </li>
                  </ul>
                </div>
              )
            }
          </div>
        </div>
        <div className="span6">
          <pre>
          { JSON.stringify(this.props.user, true, '  ') }
          </pre>
        </div>
      </div>
    )
  }
});

module.exports = React.createClass({
  displayName: 'Homepage',
  render: function () {
    return this.props.user ?
      <UserHomepage {...this.props} /> :
      <div>Homepage</div>
  }
});
