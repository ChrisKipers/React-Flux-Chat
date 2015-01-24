'use strict';
var io = require('socket.io-client');
var ChatRoomActions = require('./actions/ChatRoomActions');
var SettingActions = require('./actions/SettingActions');
var UserActions = require('./actions/UserActions');
var ACTIONS = require('./constants').ACTIONS;

var socket = io();
socket.on('connect', function() {
  socket.on(ACTIONS.ADD_MESSAGE, function(message) {
    ChatRoomActions.addMessage(message);
  });
  socket.on(ACTIONS.ADD_ROOM, function(room) {
    ChatRoomActions.addRoom(room);
  });
  socket.on(ACTIONS.INITIALIZE_STORES, function(initalizationData) {
    SettingActions.setUserFromServer(initalizationData.user);
    ChatRoomActions.setMessages(initalizationData.roomsById);
    UserActions.setUsers(initalizationData.users);
  });
  socket.on(ACTIONS.SET_USERS, function(users) {
    UserActions.setUsers(users);
  });
  socket.on(ACTIONS.ADD_ROOM_SUCCESS, function(room) {
    ChatRoomActions.addRoomSuccess(room);
  });
  socket.on(ACTIONS.UPDATE_MESSAGE, function (message) {
    ChatRoomActions.updateMessage(message);
  });
  socket.on(ACTIONS.UPDATE_ROOM, function (room) {
    ChatRoomActions.updateRoom(room);
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

function submitMessageUpdate(messageId, roomId, messageContent) {
  socket.emit(ACTIONS.SUBMIT_MESSAGE_UPDATE, {
    _id: messageId,
    roomId: roomId,
    content: messageContent
  });
}

function submitRoomUpdate(roomId, name) {
  socket.emit(ACTIONS.SUBMIT_ROOM_UPDATE, {
    _id: roomId,
    name: name
  });
}

module.exports = {
  submitMessage: submitMessage,
  submitNewRoom: submitNewRoom,
  submitNewUserName: submitNewUserName,
  submitMessageUpdate: submitMessageUpdate,
  submitRoomUpdate: submitRoomUpdate
};