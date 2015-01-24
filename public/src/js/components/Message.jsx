'use strict';
/*jshint quotmark:false */
var React = require('react');
var moment = require('moment');
var TextRenderer = require('./TextRenderer.jsx');
var ChatRoomActions = require('../actions/ChatRoomActions');

var Message = React.createClass({
  render: function () {
    var formatedDate = moment(this.props.date).format('lll');
    return (
      <div className="message">
        <div className="info">
          <div className="author">
          {this.props.user.userName}
          </div>
          <span className="date-time">
            {formatedDate}
          </span>
        </div>
        <div className="content">
          <TextRenderer text={this.props.content} editable={this.props.editable} onSubmit={this._updateMessage}/>
        </div>
      </div>
    );
  },
  _updateMessage: function(newContent) {
    ChatRoomActions.updateMessageContentFromUI(this.props._id, this.props.roomId, newContent);
  }
});

module.exports = Message;