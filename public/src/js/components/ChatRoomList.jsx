'use strict';
/*jshint quotmark:false */
var React = require('react/addons');
var _ = require('lodash');

var ChatRoomListItem = require('./ChatRoomListItem.jsx');

var ChatRoomStore = require('../stores/ChatRoomStore');
var AppStore = require('../stores/AppStore');
var SettingStore = require('../stores/SettingsStore');

var ChatRoomList = React.createClass({
  getInitialState: function () {
    return {roomsById: ChatRoomStore.getAll(), roomStateById: _.indexBy(AppStore.getChatRoomStates(), 'roomId'), usersRooms: SettingStore.getUser().rooms};
  },
  componentDidMount: function () {
    ChatRoomStore.addChangeListener(this._onRoomsChange);
    AppStore.addChangeListener(this._onRoomStateChange);
    SettingStore.addChangeListener(this._onSettingsChange);
  },
  componentWillUnmount: function () {
    ChatRoomStore.removeChangeListener(this._onRoomsChange);
    AppStore.removeChangeListener(this._onRoomStateChange);
    SettingStore.removeChangeListener(this._onSettingsChange);
  },
  _onRoomsChange: function () {
    this.setState({roomsById: ChatRoomStore.getAll()});
  },
  _onRoomStateChange: function () {
    this.setState({roomStateById: _.indexBy(AppStore.getChatRoomStates(), 'roomId')});
  },
  _onSettingsChange: function () {
    this.setState({usersRooms: SettingStore.getUser().rooms});
  },
  render: function() {
    var rooms = this.state.usersRooms.map(function(roomId) {
      return this.state.roomsById[roomId];
    }.bind(this));
    var roomComponents = rooms.map(function(room) {
      var roomState = this.state.roomStateById[room._id];
      return <ChatRoomListItem {...roomState} name={room.name} roomId={room._id} key={room._id} />;
    }.bind(this));
    return (
      <ul className="room-list">
        {roomComponents}
      </ul>
    );
  }
});

module.exports = ChatRoomList;