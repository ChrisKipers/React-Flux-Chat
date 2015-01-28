'use strict';
/*jshint quotmark:false */
var React = require('react');

var SettingsDropdown = require('./SettingsDropdown.jsx');

var AppActions = require('../actions/AppActions');

var AppHeader = React.createClass({
  getInitialState: function() {
    return {areSettingsShown: false};
  },
  render: function() {
    var settingDropdown = this.state.areSettingsShown ? 
      <SettingsDropdown onClose={this._closeSettings} /> : undefined;
    return (
      <header>
        <span className="list-icon" onClick={AppActions.toggleNav}></span>
        <span className="title">React + Flux Chat</span>
        <span className="settings-header-section">
          <span className="settings-icon" onClick={this._toggleSettingVisibility}></span>
          {settingDropdown}
        </span>
      </header>
    );
  },
  _closeSettings: function() {
    this.setState({areSettingsShown: false});
  },
  _toggleSettingVisibility: function() {
    var isSettingsOpen = this.state.areSettingsShown;
    this.setState({areSettingsShown: !isSettingsOpen});
  }
});

module.exports = AppHeader;