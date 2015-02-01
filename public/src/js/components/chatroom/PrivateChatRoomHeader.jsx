'use strict';
/*jshint quotmark:false */
var React = require('react/addons');
var cx = React.addons.classSet;
var _ = require('lodash');

var AppActions = require('../../actions/AppActions');

var PrivateChatRoomHeader = React.createClass({
  render: function() {
    var displayUser = this._getDisplayedUser();

    var unlockComponentOrNull = this.props.locked ?
      <div className="close-button" onClick={this._unlockRoom}></div> : null;

    var classes = cx({
      'chat-room-header': true,
      'locked': this.props.locked
    });
    return (
      <div className={classes}>
        <div>
          <div className="display-user-name">
            {displayUser.userName}
          </div>
          {unlockComponentOrNull}
        </div>
      </div>
    );
  },
  _unlockRoom: function() {
    AppActions.unlockRoom(this.props.room._id);
  },
  _getDisplayedUser: function () {
    var displayUserId = this.props.user._id === this.props.room.creatorId ?
      this.props.room.recipientId : this.props.room.creatorId;
    return _.find(this.props.users, {_id: displayUserId});
  }
});

module.exports = PrivateChatRoomHeader;