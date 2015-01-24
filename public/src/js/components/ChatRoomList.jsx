'use strict';
/*jshint quotmark:false */
var React = require('react');
var ListItemWrapper = require('./ListItemWrapper.jsx');

var ChatRoomList = React.createClass({
  render: function() {
    var roomComponents = this.props.rooms.map(function(room) {
      return (
        <ListItemWrapper onClick={this._selectRoom.bind(this, room)} key={room._id}>{room.name}</ListItemWrapper>
      );
    }.bind(this));
    return (
      <ul className="room-list">
        {roomComponents}
      </ul>
    );
  },
  _selectRoom: function(room) {
    this.props.onRoomSelect(room);
  }
});

module.exports = ChatRoomList;