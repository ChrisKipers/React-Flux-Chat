/*jshint quotmark:false */
var React = require('react');
var ChatRoom = require('./ChatRoom.jsx');
var ChatRoomList = require('./ChatRoomList.jsx');
var UserList = require('./UserList.jsx');
var TextRenderer = require('./TextRenderer.jsx');
var MessageActions = require('./../actions/MessageActions');
var AppHeader = require('./AppHeader.jsx');

var App = React.createClass({
  getInitialState: function() {
    return {room: 'General'};
  },
  render: function() {
    return (
      <div>
        <AppHeader />
        <div className="app-content">
          <div className="chat-side-bar">
            <ChatRoomList onRoomSelect={this._changeRoom}/>
            <UserList />
            <div className="new-chat-room">
              <TextRenderer text="Create Room" onSubmit={this._createNewChatRoom} />
            </div>
          </div>
          <div className="chat-room-col">
            <ChatRoom room={this.state.room}/>
          </div>
        </div>
      </div>
    );
  },
  _changeRoom: function(room) {
    this.setState({room: room});
  },
  _createNewChatRoom: function(room) {
    MessageActions.submitRoom(room);
    this._changeRoom(room);
  },
  _settingsChange: function(newSettings) {
    this.setState({settings: newSettings, areSettingsShown: false});
  },
  _closeSettings: function() {
    this.setState({areSettingsShown: false});
  },
  _toggleSettingVisibility: function() {
    var isSettingsOpen = this.state.areSettingsShown;
    this.setState({areSettingsShown: !isSettingsOpen});
  }
});

module.exports = App;