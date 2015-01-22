'use strict';
var io = require('socket.io-client');
var MessageActions = require('./actions/MessageActions');
var SettingActions = require('./actions/SettingActions');
var UserActions = require('./actions/UserActions');
var ACTIONS = require('./constants').ACTIONS;

var socket = io();
socket.on('connect', function() {
  socket.on(ACTIONS.ADD_MESSAGE, function(message) {
    MessageActions.addMessage(message);
  });
  socket.on(ACTIONS.ADD_ROOM, function(room) {
    MessageActions.addRoom(room);
  });
  socket.on(ACTIONS.SET_MESSAGES, function(allMessages) {
    MessageActions.setMessages(allMessages);
  });
  socket.on(ACTIONS.SET_USER_FROM_SERVER, function(user) {
    SettingActions.setUserFromServer(user);
  });
  socket.on(ACTIONS.SET_USERS, function(users) {
    UserActions.setUsers(users);
  });
});


function submitMessage(message) {
  socket.emit(ACTIONS.SUBMIT_MESSAGE, message);
}

function submitNewRoom(room) {
  socket.emit(ACTIONS.SUBMIT_ROOM, room);
}

function submitNewUserName(userName) {
  socket.emit(ACTIONS.SET_USER_NAME_FROM_UI, userName);
}

module.exports = {
  submitMessage: submitMessage,
  submitNewRoom: submitNewRoom,
  submitNewUserName: submitNewUserName
};