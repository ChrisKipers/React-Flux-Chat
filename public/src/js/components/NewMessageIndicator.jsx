'use strict';
/*jshint quotmark:false */
var React = require('react/addons');

var NewMessageIndicator = React.createClass({
  render: function () {
    var missedMessages = this.props.missedMessages || 0;
    var numberOfMissingMessagesString = missedMessages > 10 ? '10+' : missedMessages.toString();
    return <div className="new-message-indicator">{numberOfMissingMessagesString}</div>;
  }
});

module.exports = NewMessageIndicator;