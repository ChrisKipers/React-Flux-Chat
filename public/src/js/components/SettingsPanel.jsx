'use strict';
/*jshint quotmark:false */
var React = require('react/addons');

var dimensions = require('../utils/dimensions');

var SettingsStore = require('../stores/SettingsStore');

var SettingActions = require('../actions/SettingActions');

var AppActions = require('../actions/AppActions');

var SettingsDropdown = React.createClass({
  getInitialState: function() {
    return {settings: {userName: SettingsStore.getUser().userName}};
  },
  componentDidMount: function() {
    SettingsStore.addChangeListener(this._onSettingsChange);
    if (!dimensions.isCompact()) {
      var userNameInputElement = this.refs.userNameInput.getDOMNode();
      userNameInputElement.focus();
      userNameInputElement.select();
    }
  },
  componentWillUnmount: function() {
    SettingsStore.removeChangeListener(this._onSettingsChange);
  },
  _submitEdit: function(event) {
    event.preventDefault();
    if (this.state.settings.userName.trim() !== '') {
      SettingActions.setUserNameFromUI(this.state.settings.userName);
      AppActions.toggleSettings();
    }
  },
  render: function() {
    return (
      <div className="settings-panel">
        <h1>Settings</h1>
        <form onSubmit={this._submitEdit}>
          <label>Username:</label>
          <input type="text" onChange={this._updateUserName} value={this.state.settings.userName} ref="userNameInput"/>
        </form>
        <div className="dialog-footer">
          <input type="button" onClick={this._submitEdit} value="Save"/>
        </div>
      </div>
    );
  },
  _updateUserName: function(event) {
    var newUserName = event.target.value;
    this.setState({settings: {userName: newUserName}});
  },
  _onSettingsChange: function() {
    this.setState({settings: {userName: SettingsStore.getUser().userName}});
  }
});

module.exports = SettingsDropdown;