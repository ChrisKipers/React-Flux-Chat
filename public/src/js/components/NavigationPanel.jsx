'use strict';
/*jshint quotmark:false */
var React = require('react/addons');

var ChatRoomList = require('./ChatRoomList.jsx');
var CreateRoomInput = require('./CreateRoomInput.jsx');
var UserList = require('./UserList.jsx');

var UserStore = require('../stores/UserStore');

var NavigationPanel = React.createClass({
  getInitialState: function () {
    return {users: UserStore.getUsers()};
  },
  componentDidMount: function () {
    UserStore.addChangeListener(this._onUsersChange);
  },

  componentWillUnmount: function () {
    UserStore.removeChangeListener(this._onUsersChange);
  },
  _onUsersChange: function () {
    this.setState({users: UserStore.getUsers()});
  },

  render: function () {
    return (
      <div>
        <div className="chat-side-bar">
          <ChatRoomList />
          <CreateRoomInput text="Create Room" />
          <UserList users={this.state.users} />
        </div>
      </div>
    );
  }
});

module.exports = NavigationPanel;