'use strict';
/*jshint quotmark:false */
var React = require('react');
var MessageActions = require('../actions/MessageActions');
var MessageList = require('./MessageList.jsx');


var ChatRoom = React.createClass({
  render: function() {
    return (
      <div className="chat-room">
        <div className="chat-room-name">{this.props.room}</div>
        <MessageList messages={this.props.messages} />
        <form onSubmit={this._submitMessage}>
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
        room: this.props.room,
        content: messageText,
        author: this.props.userName,
        date: Date.now()
      };
      MessageActions.submitMessage(newMessage);
    }
    this.refs.messageInput.getDOMNode().value = "";
  }
});

module.exports = ChatRoom;