'use strict';
var io = require('socket.io-client');
var MessageActions = require('./actions/MessageActions');
var SettingActions = require('./actions/SettingActions');
var UserActions = require('./actions/UserActions');
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
  });
  socket.on(Constants.SET_USER_NAME_FROM_SERVER, function(userName) {
    SettingActions.setUserNameFromServer(userName);
  });
  socket.on(Constants.SET_USERS, function(users) {
    UserActions.setUsers(users);
  });
});


function submitMessage(message) {
  socket.emit(Constants.SUBMIT_MESSAGE, message);
}

function submitNewRoom(room) {
  socket.emit(Constants.SUBMIT_ROOM, room);
}

function submitNewUserName(userName) {
  socket.emit(Constants.SET_USER_NAME_FROM_UI, userName);
}

module.exports = {
  submitMessage: submitMessage,
  submitNewRoom: submitNewRoom,
  submitNewUserName: submitNewUserName
};