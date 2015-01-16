var React = require('react');
var SettingsStore = require('../stores/SettingsStore');
var SettingActions = require('../actions/SettingActions');

var Settings = React.createClass({
  getInitialState: function() {
    return {settings: {userName: SettingsStore.getUserName()}};
  },
  componentDidMount: function() {
    SettingsStore.addChangeListener(this._onSettingsChange);
  },
  componentWillUnmount: function() {
    SettingsStore.removeChangeListener(this._onSettingsChange);
  },
  _submitEdit: function(event) {
    event.preventDefault();
    SettingActions.setUserNameFromUI(this.state.settings.userName);
    this.props.onClose();
  },
  render: function() {
    return (
      <div className="settings-dropdown">
        <h1>Settings</h1>
        <input type="button" className="close-botton" onClick={this.props.onClose}/>
        <form onSubmit={this._submitEdit}>
          <label>Username:</label>
          <input typ="text" onChange={this._updateUserName} value={this.state.settings.userName}/>
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
    this.setState({settings: {userName: SettingsStore.getUserName()}});
  }
});

module.exports = Settings;