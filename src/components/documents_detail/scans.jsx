"use strict";

var React = require('react')

module.exports = React.createClass({
  displayName: 'ScanList',
  getInitialState: function () {
    return { viewer: null, currentPage: null, currentPageOverlay: null }
  },
  componentDidMount: function () {
    // Initiate the scan viewer
    var leaflet = require('leaflet')
      , viewerEl = React.findDOMNode(this).querySelector('.scan-viewer')
      , viewer

    viewer = leaflet.map(viewerEl, {
      minZoom: 1,
      maxZoom: 8,
      center: [0, 0],
      zoom: 2,
      crs: leaflet.CRS.Simple,
      attributionControl: false
    });

    this.setState({ viewer });
  },
  componentWillUnmount: function () {
    // Tear down the scan viewer
    if (this.state.viewer) this.state.viewer.remove();
  },
  handleClick: function (scan, index, e) {
    e.preventDefault();
    this.viewScan(scan.get('image'), scan.get('height'), scan.get('width'));
    this.setState({ currentPage: index });
  },
  viewScan: function (url, height, width) {
    var leaflet = require('leaflet')
      , sw = this.map.unproject([0, height], this.map.getMaxZoom() - 3)
      , ne = this.map.unproject([width, 0], this.map.getMaxZoom() - 3)
      , bounds = new leaflet.LatLngBounds(sw, ne)
      , overlay = leaflet.imageOverlay(url, bounds)

    if (this.state.currentPageOverlay) {
      this.state.currentPageOverlay.remove();
    }

    overlay.addTo(this.state.viewer);
    this.state.viewer.setMaxBounds(bounds);
    this.state.viewer.fitBounds(bounds, { animate: false });

    if (this.state.viewer.getZoom() > 5) {
      this.state.viewer.setZoom(5, { animate: false });
    }

    this.setState({ currentPageOverlay: overlay });
  },
  render: function () {
    return (
      <div>
        <h2>Scans</h2>
        <div id="scanlist-container">
          <ul id="scan-list">
            {
              this.props.scans.map((scan, i) =>
                <li onClick={this.handleClick.bind(null, scan, i)} key={scan.hashCode()}>
                  <a className="scan btn" href={scan.get('image')}>
                    {i + 1}
                  </a>
                </li>
              )
            }
          </ul>
        </div>
        <div className="scan-viewer" style={{ width: '100%', height: '700' }}></div>
      </div>
    )
  }
});
