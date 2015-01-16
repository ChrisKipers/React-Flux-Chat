var React = require('react');
var MessageStore = require('../stores/MessageStore');
var MessageActions = require('../actions/MessageActions');
var MessageList = require('./MessageList.jsx');
var SettingsStore = require('../stores/SettingsStore');

var ChatRoom = React.createClass({
  getInitialState: function() {
    return {userName: SettingsStore.getUserName()};
  },

  componentDidMount: function() {
    MessageStore.addChangeListener(this._onMessagesChange);
    SettingsStore.addChangeListener(this._onSettingsChange);
  },

  componentWillUnmount: function() {
    MessageStore.removeChangeListener(this._onMessagesChange);
    SettingsStore.addChangeListener(this._onSettingsChange);
  },

  render: function() {
    var messages = this._getRoomMessages();
    return (
      <div className="chat-room">
        <div className="chat-room-name">{this.props.room}</div>
        <MessageList messages={messages} />
        <form onSubmit={this._submitMessage}>
          <input type="text" placeholder="Enter Message" ref="messageInput" />
        </form>
      </div>
    );
  },

  _onMessagesChange: function() {
    this.setState({messages: this._getRoomMessages()});
  },

  _onSettingsChange: function() {
    this.setState({userName: SettingsStore.getUserName()});
  },

  _getRoomMessages: function() {
    var allMessages = MessageStore.getAll();
    return allMessages[this.props.room] || [];
  },

  _submitMessage: function(e) {
    e.preventDefault();
    var messageText = this.refs.messageInput.getDOMNode().value;
    var newMessage = {
      room: this.props.room,
      content: messageText,
      author: this.state.userName,
      date: Date.now()
    };
    MessageActions.submitMessage(newMessage);
    this.refs.messageInput.getDOMNode().value = "";
  }
});

module.exports = ChatRoom;