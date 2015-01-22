'use strict';
/*jshint quotmark:false */
var React = require('react');

var UserList = React.createClass({
  render: function() {
    var roomComponents = this.props.users.map(function(user) {
      return (
        <li>{user.userName}</li>
      );
    });
    return (
      <ul className="user-list">
        {roomComponents}
      </ul>
    );
  }
});

module.exports = UserList;