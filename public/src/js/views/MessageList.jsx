var React = require('react');
var Message = require('./Message.jsx');
var _ = require('lodash');

var MessageList = React.createClass({
  componentDidMount: function() {
    this._onScroll = _.debounce(this._onScroll.bind(this), 200);
  },
  getInitialState: function() {
    return {lockedOnBottom: true};
  },
  componentDidUpdate: function() {
    if (this.state.lockedOnBottom) {
      var lastMessageElement = _.last(this.getDOMNode().children);
      if (lastMessageElement) {
        lastMessageElement.scrollIntoView();
      }
    }
  },
  render: function() {
    var messageComponents = this.props.messages.map(function(message) {
      return (
        <Message author={message.author} content={message.content} date={message.date}/>
      );
    });
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
});

module.exports = MessageList;