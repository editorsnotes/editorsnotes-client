"use strict";

var React = require('react')
  , Immutable = require('immutable')

module.exports = React.createClass({
  displayName: 'DocumentItemList',

  propTypes: {
    documents: React.PropTypes.instanceOf(Immutable.List)
  },

  render() {
    var { documents } = this.props

    return (
      <div>
        {
          documents.map(doc =>
            <div key={doc.get('id')}>
              <h3>
                <a
                    href={doc.get('url')}
                    dangerouslySetInnerHTML={{ __html: doc.get('description') }} />
              </h3>
            </div>
          )
        }
      </div>
    )
  }
});
