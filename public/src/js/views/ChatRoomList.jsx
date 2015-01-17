var React = require('react');
var MessageStore = require('../stores/MessageStore');

var ChatRoomList = React.createClass({
  getInitialState: function() {
    return {rooms: this._getRooms()};
  },

  componentDidMount: function() {
    MessageStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    MessageStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var roomComponents = this.state.rooms.map(function(room) {
      return (
        <li onClick={this._selectRoom}>{room}</li>
      );
    }.bind(this));
    return (
      <ul className="room-list">
        {roomComponents}
      </ul>
    );
  },

  _onChange: function() {
    this.setState({rooms: this._getRooms()});
  },

  _getRooms: function() {
    var allMessages = MessageStore.getAll();
    return Object.keys(allMessages);
  },

  _selectRoom: function(e) {
    var room = e.target.innerHTML;
    this.props.onRoomSelect(room);
  }
});

module.exports = ChatRoomList;