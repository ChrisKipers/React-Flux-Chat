'use strict';
/*jshint quotmark:false */
var React = require('react');
var ChatRoomActions = require('../actions/ChatRoomActions');
var TextRenderer = require('./TextRenderer.jsx');
var moment = require('moment');

var ChatRoomHeader = React.createClass({
  render: function() {
    var formatedCreatedDate = moment(this.props.room.createdDate).format('lll');
    return (
      <div className="chat-room-header">
        <div className="chat-room-name">
          <TextRenderer text={this.props.room.name} editable={this.props.editable} onSubmit={this._updateRoomName}/>

        </div>
        <div className="details">Created by {this.props.room.creator.userName} on {formatedCreatedDate}</div>
      </div>
    );
  },
  _updateRoomName: function(roomName) {
    ChatRoomActions.updateRoomFromUI(this.props.room._id, roomName);
  }
});

module.exports = ChatRoomHeader;