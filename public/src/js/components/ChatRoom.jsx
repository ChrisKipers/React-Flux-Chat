'use strict';
/*jshint quotmark:false */
var React = require('react/addons');
var _ = require('lodash');
var dimensions = require('../utils/dimensions');

var ChatRoomHeader = require('./ChatRoomHeader.jsx');
var MessageActions = require('../actions/MessageActions');
var MessageList = require('./MessageList.jsx');

var UserStore = require('../stores/UserStore');
var SettingsStore = require('../stores/SettingsStore');

var ChatRoom = React.createClass({
  getInitialState: function () {
    return {users: UserStore.getUsers(), user: SettingsStore.getUser()};
  },
  componentDidMount: function () {
    SettingsStore.addChangeListener(this._onSettingsChange);
    UserStore.addChangeListener(this._onUsersChange);
    if (!dimensions.isCompact()) {
      this.refs.messageInput.getDOMNode().focus();
    }
  },

  componentWillUnmount: function () {
    UserStore.removeChangeListener(this._onUsersChange);
    SettingsStore.removeChangeListener(this._onSettingsChange);
  },

  render: function() {
    var isRoomEditable = this.props.room.creatorId === this.state.user._id;
    var mergedRoomData = this._mergeRoomWithUserData();
    return (
      <div className="chat-room">
        <ChatRoomHeader room={mergedRoomData} editable={isRoomEditable} locked={this.props.locked}/>
        <MessageList messages={mergedRoomData.messages} user={this.state.user}/>
        <form onSubmit={this._submitMessage} className="new-message-form">
          <input type="text" placeholder="Enter Message" ref="messageInput" />
        </form>
      </div>
    );
  },
  _submitMessage: function(e) {
    e.preventDefault();
    var messageText = this.refs.messageInput.getDOMNode().value;
    if (messageText.trim().length > 0) {
      var newMessage = {
        roomId: this.props.room._id,
        content: messageText,
        userId: this.state.user._id,
        date: Date.now()
      };
      MessageActions.submitMessage(newMessage);
    }
    this.refs.messageInput.getDOMNode().value = "";
  },

  _onUsersChange: function() {
    this.setState({users: UserStore.getUsers()});
  },

  _onSettingsChange: function() {
    this.setState({user: SettingsStore.getUser()});
  },

  _mergeRoomWithUserData: function () {
    var room = this.props.room;
    var usersById = _.indexBy(this.state.users, '_id');
    var messagesWithUserData = room.messages.map(function (message) {
      var messagesUser = usersById[message.userId] || {};
      return _.extend({}, message, {
        user: messagesUser
      });
    }.bind(this));
    var creator = usersById[room.creatorId];
    return _.extend({}, room, {
      messages: messagesWithUserData,
      creator: creator
    });
  }
});

module.exports = ChatRoom;