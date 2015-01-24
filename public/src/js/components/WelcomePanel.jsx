'use strict';
/*jshint quotmark:false */
var React = require('react');

var SettingsStore = require('../stores/SettingsStore');

var SettingActions = require('../actions/SettingActions');

var WelcomePanel = React.createClass({
  getInitialState: function () {
    return {userName: SettingsStore.getUser().userName};
  },
  componentDidMount: function () {
    SettingsStore.addChangeListener(this._onSettingsChange);
  },

  componentWillUnmount: function () {
    SettingsStore.removeChangeListener(this._onSettingsChange);
  },
  render: function() {
    return (
      <div className="welcome-panel">
        <h1>Welcome to React + Flux Chat</h1>
        <p>
          This is a simple chat application built using <a href="http://facebook.github.io/react/">React</a> in conjunction
          with the <a href="http://facebook.github.io/flux/docs/overview.html">Flux</a> architecture pattern!
        </p>
        <p>
          Currently your user name is
          <input value={this.state.userName} type="text" onChange={this._onUserNameInputChange}/>
        </p>
        <p>
          If you wish to edit your username later on, click the <span className="settings-icon"></span> icon in the top right corner.
        </p>
        <p>
          You can lock a chat room to your window by double clicking on the room name in the left panel! You can lock as many
          rooms as you would like, this allows you to chat in multiple rooms at the same time!
        </p>
        <p>
          You can also edit the content of any of your messages by clicking the message content. You can also edit the name of any of the
          rooms you created by clicking on the room name in the chat room header.
        </p>
        <p>
          To get started click on a chat room in the sidebar! Enjoy!
        </p>
      </div>
    );
  },
  _onSettingsChange: function () {
    this.setState({userName: SettingsStore.getUser().userName});
  },
  _onUserNameInputChange: function (event) {
    var newUserName = event.target.value;
    this.setState({userName: newUserName});
    SettingActions.setUserNameFromUI(newUserName);
  }
});

module.exports = WelcomePanel;