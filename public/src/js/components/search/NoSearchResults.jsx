'use strict';
/*jshint quotmark:false */
var React = require('react/addons');

var NoSearchResults = React.createClass({
  render: function () {
    return (
      <div className="no-search-results">
        No Matches
      </div>
    );
  }
});

module.exports = NoSearchResults;