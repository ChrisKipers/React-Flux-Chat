'use strict';
/*jshint quotmark:false */
var React = require('react/addons');

var ChatRoomList = require('./ChatRoomList.jsx');
var CreateRoomInput = require('./CreateRoomInput.jsx');
var SearchBox = require('./../search/SearchBox.jsx');

var UserStore = require('../../stores/UserStore');

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
          <SearchBox />
          <ChatRoomList />
          <CreateRoomInput text="Create Room" />
        </div>
      </div>
    );
  }
});

module.exports = NavigationPanel;