'use strict';
/*jshint quotmark:false */
var React = require('react/addons');
var _ = require('lodash');

var ChatRoomListItem = require('./ChatRoomListItem.jsx');

var ChatRoomStore = require('../stores/ChatRoomStore');
var AppStore = require('../stores/AppStore');

var ChatRoomList = React.createClass({
  getInitialState: function () {
    return {roomsById: ChatRoomStore.getAll(), roomStateById: _.indexBy(AppStore.getChatRoomStates(), 'roomId')};
  },
  componentDidMount: function () {
    ChatRoomStore.addChangeListener(this._onRoomsChange);
    AppStore.addChangeListener(this._onRoomStateChange);
  },
  componentWillUnmount: function () {
    ChatRoomStore.removeChangeListener(this._onRoomsChange);
    AppStore.removeChangeListener(this._onRoomStateChange);
  },
  _onRoomsChange: function () {
    this.setState({roomsById: ChatRoomStore.getAll()});
  },
  _onRoomStateChange: function () {
    this.setState({roomStateById: _.indexBy(AppStore.getChatRoomStates(), 'roomId')});
  },
  render: function() {
    var rooms = _.values(this.state.roomsById);
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