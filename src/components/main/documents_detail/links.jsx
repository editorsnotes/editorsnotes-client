"use strict";

var React = require('react')
  , Translate = require('../../shared/translate.jsx')
  , strings = require('./strings')

module.exports = React.createClass({
  displayName: 'DocumentLinks',

  render: function () {
    var { doc } = this.props

    return (
      <div>
        {
          doc.get('links') && (
            <div>
              <h4>
                <Translate
                    text={strings.externalLinks}
                    number={doc.get('links').size} />
              </h4>

              {
                doc.get('links').map(link =>
                  <li key={link}>
                    <a style={{ textDecoration: 'underline' }} href={link.get('url')}>
                      {link.get('url')}
                    </a>
                    <div>{link.get('description')}</div>
                  </li>
                )
              }
            </div>
          )
        }
      </div>
    )
  }
});
