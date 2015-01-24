'use strict';
/*jshint quotmark:false */
var React = require('react');
var _ = require('lodash');

var Message = require('./Message.jsx');

var MessageList = React.createClass({
  componentDidMount: function() {
    this._onScroll = _.debounce(this._onScroll.bind(this), 200);
    this._updateScrollPosition();
  },
  getInitialState: function() {
    return {lockedOnBottom: true};
  },
  componentDidUpdate: function() {
    this._updateScrollPosition();
  },
  render: function() {
    var messageComponents = this.props.messages.map(function(message) {
      var isEditable = message.userId === this.props.user._id;
      return (
        <Message {...message} editable={isEditable} key={message._id}/>
      );
    }.bind(this));
    return (
      <div className="message-list" onScroll={this._onScroll}>
        {messageComponents}
      </div>
    );
  },
  _onScroll: function() {
    var listElement = this.getDOMNode();
    var isAtBottom = listElement.scrollTop + listElement.offsetHeight === listElement.scrollHeight;
    this.setState({lockedOnBottom: isAtBottom});
  },
  _updateScrollPosition: function () {
    if (this.state.lockedOnBottom) {
      var lastMessageElement = _.last(this.getDOMNode().children);
      if (lastMessageElement) {
        lastMessageElement.scrollIntoView();
      }
    }
  }
});

module.exports = MessageList;