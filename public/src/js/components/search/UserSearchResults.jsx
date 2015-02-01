'use strict';
/*jshint quotmark:false */
var React = require('react/addons');
var ChatRoomActions = require('../../actions/ChatRoomActions');

var UserSearchResult = React.createClass({
  render: function () {
    return (
      <li className="user-search-result" onMouseDown={this._joinRoom}>
      {this.props.userName}
      </li>
    );
  },
  _joinRoom: function() {
    ChatRoomActions.submitPrivateRoom(this.props._id);
    this.props.onRoomJoin();
  }
});

module.exports = UserSearchResult;