'use strict';
/*jshint quotmark:false */
var React = require('react/addons');
var _ = require('lodash');
var dimensions = require('../../utils/dimensions');

var ChatRoomHeader = require('./ChatRoomHeader.jsx');
var PrivateChatRoomHeader = require('./PrivateChatRoomHeader.jsx');
var MessageList = require('./MessageList.jsx');

var MessageStore = require('../../stores/MessageStore');

var MessageActions = require('../../actions/MessageActions');

var ChatRoom = React.createClass({
  getInitialState: function () {
    return {messages: MessageStore.getAllMessages()[this.props.room._id]};
  },
  componentDidMount: function () {
    MessageStore.addChangeListener(this._onMessageChange);
    if (!dimensions.isCompact()) {
      this.refs.messageInput.getDOMNode().focus();
    }
  },

  componentWillUnmount: function () {
    MessageStore.removeChangeListener(this._onMessageChange);
  },

  render: function() {
    var isRoomEditable = this.props.room.creatorId === this.props.user._id;
    var mergedRoomData = this._mergeRoomWithUserData();
    var headerComponent = this.props.room.isPrivate ?
      <PrivateChatRoomHeader room={mergedRoomData} user={this.props.user} users={this.props.users} locked={this.props.locked}/> :
      <ChatRoomHeader room={mergedRoomData} editable={isRoomEditable} locked={this.props.locked}/>;

    return (
      <div className="chat-room">
        {headerComponent}
        <MessageList messages={mergedRoomData.messages} user={this.props.user}/>
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
        userId: this.props.user._id,
        date: Date.now()
      };
      MessageActions.submitMessage(newMessage);
    }
    this.refs.messageInput.getDOMNode().value = "";
  },
  _onMessageChange: function() {
    this.setState({messages: MessageStore.getAllMessages()[this.props.room._id]});
  },
  _mergeRoomWithUserData: function () {
    var room = this.props.room;
    var usersById = _.indexBy(this.props.users, '_id');
    var messagesWithUserData = this.state.messages.map(function (message) {
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