'use strict';
/*jshint quotmark:false */
var React = require('react');
var _ = require('lodash');
var ChatRoom = require('./ChatRoom.jsx');
var ChatRoomList = require('./ChatRoomList.jsx');
var UserList = require('./UserList.jsx');
var CreateRoomInput = require('./CreateRoomInput.jsx');
var ChatRoomActions = require('./../actions/ChatRoomActions');
var AppHeader = require('./AppHeader.jsx');
var WelcomePanel = require('./WelcomePanel.jsx');
var LoadingScreen = require('./LoadingScreen.jsx');
var SettingsStore = require('../stores/SettingsStore');
var ChatRoomStore = require('../stores/ChatRoomStore');
var UserStore = require('../stores/UserStore');

var App = React.createClass({
  getInitialState: function () {
    return {
      user: SettingsStore.getUser(),
      roomsById: ChatRoomStore.getAll(),
      usersById: this._getUsersById()
    };
  },

  componentDidMount: function () {
    ChatRoomStore.on(ChatRoomStore.events.CHANGE, this._onMessagesChange);
    ChatRoomStore.on(ChatRoomStore.events.ADD_SUCCESS, this._changeRoom);
    SettingsStore.addChangeListener(this._onSettingsChange);
    UserStore.addChangeListener(this._onUsersChange);
  },

  componentWillUnmount: function () {
    ChatRoomStore.removeListener(ChatRoomStore.events.CHANGE, this._onMessagesChange);
    ChatRoomStore.removeListener(ChatRoomStore.events.ADD_SUCCESS, this._changeRoom);
    SettingsStore.removeChangeListener(this._onSettingsChange);
    UserStore.removeChangeListener(this._onUsersChange);
  },

  render: function () {
    var isLoading = this._isLoading();
    var bodyComponent;
    if (isLoading) {
      bodyComponent = this._getLoadingBody();
    } else {
      bodyComponent = this._getChatBody();
    }
    return (
      <div>
        <AppHeader />
        <div className="app-content">
            {bodyComponent}
        </div>
      </div>
    );
  },
  _changeRoom: function (room) {
    this.setState({room: room._id});
  },
  _createNewChatRoom: function (roomName) {
    ChatRoomActions.submitRoom(roomName);
  },
  _onMessagesChange: function () {
    this.setState({roomsById: ChatRoomStore.getAll()});
  },
  _onSettingsChange: function () {
    this.setState({user: SettingsStore.getUser()});
  },
  _onUsersChange: function () {
    this.setState({usersById: this._getUsersById()});
  },
  _getUsersById: function () {
    return _.indexBy(UserStore.getUsers(), '_id');
  },
  _mergeRoomWithUserData: function (room) {
    var messagesWithUserData = room.messages.map(function (message) {
      var messagesUser = this.state.usersById[message.userId] || {};
      return _.extend({}, message, {
        user: messagesUser
      });
    }.bind(this));
    var creator = this.state.usersById[room.creatorId];
    return _.extend({}, room, {
      messages: messagesWithUserData,
      creator: creator
    });
  },
  _isLoading: function () {
    return !_.every([UserStore, ChatRoomStore, SettingsStore], function (store) {
      return store.isInitialized();
    });
  },
  _getChatBody: function () {
    var mainViewComponent;
    if (!this.state.room) {
      mainViewComponent = <WelcomePanel user={this.state.user}/>;
    } else {
      var activeRoomWithUserData = this._mergeRoomWithUserData(this.state.roomsById[this.state.room]);
      mainViewComponent = <ChatRoom room={activeRoomWithUserData} user={this.state.user}/>;
    }
    var rooms = _.values(this.state.roomsById);
    var users = _.values(this.state.usersById);
    return (
      <div>
        <div className="chat-side-bar">
          <ChatRoomList rooms={rooms} onRoomSelect={this._changeRoom}/>
          <CreateRoomInput text="Create Room" onSubmit={this._createNewChatRoom} />
          <UserList users={users} />
        </div>
        <div className = "chat-room-col" >
            {mainViewComponent}
        </div>
      </div>
    );
  },
  _getLoadingBody: function () {
    return <LoadingScreen />;
  }
});

module.exports = App;