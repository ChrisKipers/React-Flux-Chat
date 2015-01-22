'use strict';
/*jshint quotmark:false */
var React = require('react');
var _ = require('lodash');
var ChatRoom = require('./ChatRoom.jsx');
var ChatRoomList = require('./ChatRoomList.jsx');
var UserList = require('./UserList.jsx');
var CreateRoomInput = require('./CreateRoomInput.jsx');
var MessageActions = require('./../actions/MessageActions');
var AppHeader = require('./AppHeader.jsx');
var SettingsStore = require('../stores/SettingsStore');
var MessageStore = require('../stores/MessageStore');
var UserStore = require('../stores/UserStore');

var App = React.createClass({
  getInitialState: function() {
    return {
      user: SettingsStore.getUser(),
      room: 'General',
      messages: MessageStore.getAll(),
      users: UserStore.getUsers()
    };
  },

  componentDidMount: function() {
    MessageStore.addChangeListener(this._onMessagesChange);
    SettingsStore.addChangeListener(this._onSettingsChange);
    UserStore.addChangeListener(this._onUsersChange);
  },

  componentWillUnmount: function() {
    MessageStore.removeChangeListener(this._onMessagesChange);
    SettingsStore.removeChangeListener(this._onSettingsChange);
    UserStore.removeChangeListener(this._onUsersChange);
  },

  render: function() {
    var messagesForActiveChatRoomWithAuthorName = this._getMessagesWithUserNameByRoom(this.state.room);
    var rooms = Object.keys(this.state.messages);
    return (
      <div>
        <AppHeader />
        <div className="app-content">
          <div className="chat-side-bar">
            <ChatRoomList rooms={rooms} onRoomSelect={this._changeRoom}/>
            <CreateRoomInput text="Create Room" onSubmit={this._createNewChatRoom} />
            <UserList users={this.state.users} />
          </div>
          <div className="chat-room-col">
            <ChatRoom room={this.state.room} user={this.state.user} messages={messagesForActiveChatRoomWithAuthorName}/>
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
    this.setState({user: SettingsStore.getUser()});
  },
  _onUsersChange: function() {
    this.setState({users: UserStore.getUsers()});
  },
  _getMessagesWithUserNameByRoom: function (roomName) {
    var messagesForActiveChatRoom = this.state.messages[roomName] || [];
    var usersById = _.indexBy(this.state.users, '_id');
    var messagesForActiveChatRoomWithAuthorName = messagesForActiveChatRoom.map(function(message) {
      var author = usersById[message.userId] || {};
      return _.extend({}, message, {
        author: author.userName || 'Unknown'
      });
    }.bind(this));
    return messagesForActiveChatRoomWithAuthorName;
  }
});

module.exports = App;