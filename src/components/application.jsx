"use strict";

const React = require('react')
    , Immutable = require('immutable')
    , classnames = require('classnames')
    , { Provider } = require('react-redux')

const Header = require('./main/header/component.jsx')
    , Footer = require('./main/footer/component.jsx')


module.exports = React.createClass({
  displayName: 'Application',

  propTypes: {
    ActiveComponent: React.PropTypes.element.isRequired,
    store: React.PropTypes.instanceOf(Immutable.Map)
  },

  render() {
    const { ActiveComponent, store } = this.props
        , { noContainer, noFooter, noHeader } = ActiveComponent.prototype

    return (
      <Provider store={store}>
        <div className="flex flex-column" style={{ minHeight: '100vh' }}>
          { !noHeader && <Header noContainer={noContainer} /> }

          <main className="flex-grow relative">
            <div className={classnames({ container: !noContainer })}>
              <ActiveComponent
                noContainer={noContainer}
                noHeader={noHeader}
                noFooter={noFooter}
              />
            </div>
          </main>

          { !noFooter && <Footer noFooter={noFooter} /> }
        </div>
      </Provider>
    )
  }
});
