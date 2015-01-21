'use strict';
/*jshint quotmark:false */
var React = require('react');

var ChatRoomList = React.createClass({
  render: function() {
    var roomComponents = this.props.rooms.map(function(room) {
      return (
        <li onClick={this._selectRoom}>{room}</li>
      );
    }.bind(this));
    return (
      <ul className="room-list">
        {roomComponents}
      </ul>
    );
  },
  _selectRoom: function(e) {
    var room = e.target.innerHTML;
    this.props.onRoomSelect(room);
  }
});

module.exports = ChatRoomList;