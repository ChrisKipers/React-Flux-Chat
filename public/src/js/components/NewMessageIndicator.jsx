'use strict';
/*jshint quotmark:false */
var React = require('react/addons');

var NewMessageIndicator = React.createClass({
  render: function () {
    var numberOfMissingMessagesString = this.props.missedMessages > 10 ? '10+' : this.props.missedMessages.toString();
    return <div className="new-message-indicator">{numberOfMissingMessagesString}</div>;
  }
});

module.exports = NewMessageIndicator;