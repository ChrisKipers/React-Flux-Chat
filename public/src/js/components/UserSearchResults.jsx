'use strict';
/*jshint quotmark:false */
var React = require('react/addons');

var UserSearchResult = React.createClass({
  render: function () {
    return (
      <li className="user-search-result" onMouseDown={this._joinRoom}>
      {this.props.userName}
      </li>
    );
  },
  _joinRoom: function() {
    this.props.onRoomJoin();
  }
});

module.exports = UserSearchResult;