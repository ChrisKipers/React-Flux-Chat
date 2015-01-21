'use strict';
/*jshint quotmark:false */
var React = require('react');
var ChatRoom = require('./ChatRoom.jsx');
var ChatRoomList = require('./ChatRoomList.jsx');
var UserList = require('./UserList.jsx');
var CreateRoomInput = require('./CreateRoomInput.jsx');
var MessageActions = require('./../actions/MessageActions');
var AppHeader = require('./AppHeader.jsx');
var SettingsStore = require('../stores/SettingsStore');
var MessageStore = require('../stores/MessageStore');

var App = React.createClass({
  getInitialState: function() {
    return {userName: SettingsStore.getUserName(), room: 'General', messages: MessageStore.getAll()};
  },

  componentDidMount: function() {
    MessageStore.addChangeListener(this._onMessagesChange);
    SettingsStore.addChangeListener(this._onSettingsChange);
  },

  componentWillUnmount: function() {
    MessageStore.removeChangeListener(this._onMessagesChange);
    SettingsStore.addChangeListener(this._onSettingsChange);
  },

  render: function() {
    var messagesForActiveChatRoom = this.state.messages[this.state.room] || [];
    var rooms = Object.keys(this.state.messages);
    return (
      <div>
        <AppHeader />
        <div className="app-content">
          <div className="chat-side-bar">
            <ChatRoomList rooms={rooms} onRoomSelect={this._changeRoom}/>
            <CreateRoomInput text="Create Room" onSubmit={this._createNewChatRoom} />
            <UserList />
          </div>
          <div className="chat-room-col">
            <ChatRoom room={this.state.room} userName={this.state.userName} messages={messagesForActiveChatRoom}/>
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
  _onMessagesChange: function() {
    this.setState({messages: MessageStore.getAll()});
  },
  _onSettingsChange: function() {
    this.setState({userName: SettingsStore.getUserName()});
  },
  _toggleSettingVisibility: function() {
    var isSettingsOpen = this.state.areSettingsShown;
    this.setState({areSettingsShown: !isSettingsOpen});
  }
});

module.exports = App;