'use strict';
/*jshint quotmark:false */
var React = require('react/addons');

var ToggleNavigationButton = require('./ToggleNavigationButton.jsx');
var ToggleSettingsButton = require('./ToggleSettingsButton.jsx');

var AppHeader = React.createClass({
  render: function() {
    return (
      <header>
        <ToggleNavigationButton />
        <span className="title">React + Flux Chat</span>
        <ToggleSettingsButton />
      </header>
    );
  }
});

module.exports = AppHeader;