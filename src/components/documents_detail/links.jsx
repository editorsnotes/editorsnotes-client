"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'DocumentLinks',
  render: function () {
    var doc = this.props.doc;
    return (
      <div>
        {
          !doc.get('links') ? '' :
            <div>
              <h4>{doc.get('links').size > 1 ? 'External links' : 'External link'}</h4>
              doc.get('links').map(link =>
                <li key={link}>
                  <a style={{ textDecoration: 'underline' }} href={link.get('url')}>
                    {link.get('url')}
                  </a>
                  <div>{link.get('description')}</div>
                </li>
              )
            </div>
        }
      </div>
    )
  }
});
