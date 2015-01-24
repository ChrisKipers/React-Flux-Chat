'use strict';
/*jshint quotmark:false */
var React = require('react');

var ListItemWrapper = React.createClass({
  render: function() {
    return <li onClick={this.props.onClick} onDoubleClick={this.props.onDoubleClick}>{this.props.children}</li>;
  }
});

module.exports = ListItemWrapper;