"use strict";

var React = require('react')
  , Immutable = require('immutable')
  , Translate = require('../../shared/translate.jsx')
  , strings = require('./strings')

function DocumentLinks({ doc }) {
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

DocumentLinks.propTypes = {
  doc: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = DocumentLinks;
