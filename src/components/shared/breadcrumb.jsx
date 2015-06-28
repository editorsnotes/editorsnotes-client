"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'Breadcrumb',

  propTypes: {
    crumbs: React.PropTypes.instanceOf(Immutable.List).isRequired
  },

  render: function () {
    return (
      <ul className="breadcrumb-top">
        {
          this.props.crumbs.pop().map(crumb =>
            <li key={crumb.hashCode()}>
              <a href={crumb.get('href')}>
                {crumb.get('label')}
              </a>
              <span className="divider">
                {' > '}
              </span>
            </li>
          )
        }

        <li className="active" dangerouslySetInnerHTML={{ __html: lastLabel }} />
      </ul>
    )
  }
});
