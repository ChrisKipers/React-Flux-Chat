'use strict';
/*jshint quotmark:false */
var React = require('react/addons');
var cx = React.addons.classSet;

var NewMessageIndicator = require('./NewMessageIndicator.jsx');

var AppActions = require('../actions/AppActions');
var SettingActions = require('../actions/SettingActions');

var ChatRoomListItem = React.createClass({
  render: function () {
    var classes = cx({
      'chat-room-list-item': true,
      locked: this.props.locked,
      active: this.props.active,
      'missing-messages': this.props.missedMessages > 0
    });

    var enterRoom = AppActions.enterRoom.bind(null, this.props.roomId);
    var lockRoom = AppActions.lockRoom.bind(null, this.props.roomId);

    return (
      <li className={classes} onClick={enterRoom} onDoubleClick={lockRoom}>
        <span className="room-name">{this.props.name}
        </span>
        <div className="action-icons">
          <NewMessageIndicator missedMessages={this.props.missedMessages}/>
          <div className="close-button" onClick={this._leaveRoom}></div>
        </div>
      </li>
    );
  },
  _leaveRoom: function(e) {
    e.stopPropagation();
    SettingActions.leaveRoom(this.props.roomId);
  }
});

module.exports = ChatRoomListItem;