'use strict';
/*jshint quotmark:false */
var React = require('react');
var _ = require('lodash');
var ListItemWrapper = require('./ListItemWrapper.jsx');

var ChatRoomStore = require('../stores/ChatRoomStore');
var ChatRoomActions = require('../actions/ChatRoomActions');

var ChatRoomList = React.createClass({
  getInitialState: function () {
    return {roomsById: ChatRoomStore.getAll()};
  },
  componentDidMount: function () {
    ChatRoomStore.on(ChatRoomStore.events.CHANGE, this._onRoomsChange);
  },
  componentWillUnmount: function () {
    ChatRoomStore.removeListener(ChatRoomStore.events.CHANGE, this._onRoomsChange);
  },
  _onRoomsChange: function () {
    this.setState({roomsById: ChatRoomStore.getAll()});
  },
  render: function() {
    var rooms = _.values(this.state.roomsById);
    var roomComponents = rooms.map(function(room) {
      //@todo Bind directly to ChatRoomAction
      var onClick = this._selectRoom.bind(this, room);
      var onDoubleClick = this._lockRoom.bind(this, room);
      return (
        <ListItemWrapper onClick={onClick} onDoubleClick={onDoubleClick} key={room._id}>{room.name}</ListItemWrapper>
      );
    }.bind(this));
    return (
      <ul className="room-list">
        {roomComponents}
      </ul>
    );
  },
  _selectRoom: function(room) {
    ChatRoomActions.enterRoom(room._id);
  },
  _lockRoom: function(room) {
    ChatRoomActions.lockRoom(room._id);
  }
});

module.exports = ChatRoomList;