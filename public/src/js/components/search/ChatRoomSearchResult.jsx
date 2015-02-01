'use strict';
/*jshint quotmark:false */
var React = require('react/addons');
var SettingActions = require('../../actions/SettingActions');

var ChatRoomSearchResult = React.createClass({
  render: function () {
    return (
      <li className="chat-room-search-result" onMouseDown={this._joinRoom}>
      {this.props.name}
      </li>
    );
  },
  _joinRoom: function() {
    SettingActions.joinRoom(this.props._id);
    this.props.onRoomJoin();
  }
});

module.exports = ChatRoomSearchResult;