'use strict';
/*jshint quotmark:false */
var React = require('react');
var cx = require('react/addons').addons.classSet;
var moment = require('moment');

var ChatRoomActions = require('../actions/ChatRoomActions');
var TextRenderer = require('./TextRenderer.jsx');

var ChatRoomHeader = React.createClass({
  render: function() {
    var formatedCreatedDate = moment(this.props.room.createdDate).format('lll');
    var unlockComponentOrNull = this.props.locked ?
      <div className="close-button" onClick={this._unlockRoom}></div> : null;
    var classes = cx({
      'chat-room-header': true,
      'locked': this.props.locked
    });
    return (
      <div className={classes}>
        <div>
          <div className="chat-room-name">
            <TextRenderer text={this.props.room.name} editable={this.props.editable} onSubmit={this._updateRoomName}/>
          </div>
          {unlockComponentOrNull}
        </div>
        <div className="details">Created by {this.props.room.creator.userName} on {formatedCreatedDate}</div>
      </div>
    );
  },
  _updateRoomName: function(roomName) {
    ChatRoomActions.updateRoomFromUI(this.props.room._id, roomName);
  },
  _unlockRoom: function() {
    ChatRoomActions.unlockRoom(this.props.room._id);
  }
});

module.exports = ChatRoomHeader;