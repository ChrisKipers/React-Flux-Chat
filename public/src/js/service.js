var io = require('socket.io-client');
var MessageActions = require('./actions/MessageActions');
var Constants = require('./constants');

var socket = io();
socket.on('connect', function() {
  socket.on(Constants.ADD_MESSAGE, function(message) {
    MessageActions.addMessage(message);
  });
  socket.on(Constants.ADD_ROOM, function(room) {
    MessageActions.addRoom(room);
  });
  socket.on(Constants.SET_MESSAGES, function(allMessages) {
    MessageActions.setMessages(allMessages);
  })
});


function submitMessage(message) {
  socket.emit(Constants.SUBMIT_MESSAGE, message);
}

function submitNewRoom(room) {
  socket.emit(Constants.SUBMIT_ROOM, room);
}

module.exports = {
  submitMessage: submitMessage,
  submitNewRoom: submitNewRoom
};