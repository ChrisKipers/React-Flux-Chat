'use strict';
/*jshint quotmark:false */
var React = require('react/addons');

var ChatRoomList = require('./ChatRoomList.jsx');
var CreateRoomInput = require('./CreateRoomInput.jsx');
var SearchBox = require('./../search/SearchBox.jsx');

var NavigationPanel = React.createClass({
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