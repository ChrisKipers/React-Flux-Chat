'use strict';
/*jshint quotmark:false */
var React = require('react');
var ChatRoomHeader = require('./ChatRoomHeader.jsx');
var ChatRoomActions = require('../actions/ChatRoomActions');
var MessageList = require('./MessageList.jsx');

var ChatRoom = React.createClass({
  render: function() {
    var isRoomEditable = this.props.room.creatorId === this.props.user._id;
    return (
      <div className="chat-room">
        <ChatRoomHeader room={this.props.room} editable={isRoomEditable}/>
        <MessageList messages={this.props.room.messages} user={this.props.user}/>
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
      ChatRoomActions.submitMessage(newMessage);
    }
    this.refs.messageInput.getDOMNode().value = "";
  }
});

module.exports = ChatRoom;