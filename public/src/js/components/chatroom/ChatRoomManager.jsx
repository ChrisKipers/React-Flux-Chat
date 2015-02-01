'use strict';
/*jshint quotmark:false */
var React = require('react/addons');
var cx = React.addons.classSet;
var _ = require('lodash');

var ChatRoom = require('./ChatRoom.jsx');

var AppStore = require('../../stores/AppStore');
var ChatRoomStore = require('../../stores/ChatRoomStore');
var UserStore = require('../../stores/UserStore');
var SettingsStore = require('../../stores/SettingsStore');

var ChatRoomManager = React.createClass({
  getInitialState: function () {
    return _.extend(
      this._getStateFromAppStore(),
      this._getStateFromChatRoomStore(),
      this._getStateFromUserStore(),
      this._getStateFromSettingsStore()
    );
  },

  componentDidMount: function () {
    AppStore.addChangeListener(this._onAppStoreChange);
    ChatRoomStore.addChangeListener(this._onChatRoomStoreChange);
    UserStore.addChangeListener(this._onUserStoreChange);
    SettingsStore.addChangeListener(this._onSettingsStoreChange);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onAppStoreChange);
    ChatRoomStore.removeChangeListener(this._onChatRoomStoreChange);
    UserStore.removeChangeListener(this._onUserStoreChange);
    SettingsStore.removeChangeListener(this._onSettingsStoreChange);
  },

  render: function () {
    var classes = cx({
      'chat-room-manager': true,
      'multiple-rooms': this.state.activeChatRooms.length > 1
    });
    var chatRoomComponents = this.state.activeChatRooms.map(function (activeChatRoomInfo) {
      return (
      <ChatRoom
        key={activeChatRoomInfo.roomId}
        room={this.state.roomsById[activeChatRoomInfo.roomId]}
        locked={activeChatRoomInfo.locked}
        users={this.state.users}
        user={this.state.user} />
      );
    }.bind(this));
    return (
      <div className={classes}>
        {chatRoomComponents}
      </div>
    );
  },

  _onAppStoreChange: function () {
    this.setState(this._getStateFromAppStore());
  },
  _onChatRoomStoreChange: function () {
    this.setState(this._getStateFromChatRoomStore());
  },
  _onUserStoreChange: function () {
    this.setState(this._getStateFromUserStore());
  },
  _onSettingsStoreChange: function () {
    this.setState(this._getStateFromSettingsStore());
  },
  _getStateFromAppStore: function () {
    return {activeChatRooms: AppStore.getActiveChatRooms()};
  },
  _getStateFromChatRoomStore: function () {
    return {roomsById: ChatRoomStore.getAll()};
  },
  _getStateFromUserStore: function() {
    return {users: UserStore.getUsers()};
  },
  _getStateFromSettingsStore: function () {
    return {user: SettingsStore.getUser()};
  }
});

module.exports = ChatRoomManager;