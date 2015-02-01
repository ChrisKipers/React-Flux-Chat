'use strict';
/*jshint quotmark:false */
var React = require('react/addons');
var cx = React.addons.classSet;

var ChatRoom = require('./ChatRoom.jsx');

var AppStore = require('../../stores/AppStore');
var ChatRoomStore = require('../../stores/ChatRoomStore');

var ChatRoomManager = React.createClass({
  getInitialState: function () {
    return {activeChatRooms: AppStore.getActiveChatRooms(), roomsById: ChatRoomStore.getAll()};
  },

  componentDidMount: function () {
    AppStore.addChangeListener(this._updateActiveChatRooms);
    ChatRoomStore.addChangeListener(this._onRoomChange);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._updateActiveChatRooms);
    ChatRoomStore.removeChangeListener(this._onRoomChange);
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
        locked={activeChatRoomInfo.locked} />
      );
    }.bind(this));
    return (
      <div className={classes}>
        {chatRoomComponents}
      </div>
    );
  },

  _updateActiveChatRooms: function () {
    this.setState({activeChatRooms: AppStore.getActiveChatRooms()});
  },

  _onRoomChange: function () {
    this.setState({roomsById: ChatRoomStore.getAll()});
  }

});

module.exports = ChatRoomManager;