'use strict';
/*jshint quotmark:false */
var React = require('react');

var ListItemWrapper = React.createClass({
  render: function() {
    return <li onClick={this.props.onClick}>{this.props.children}</li>;
  }
});

module.exports = ListItemWrapper;