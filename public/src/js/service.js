'use strict';
var io = require('socket.io-client');

var ACTIONS = require('./constants').ACTIONS;

var ChatRoomActions = require('./actions/ChatRoomActions');
var SettingActions = require('./actions/SettingActions');
var UserActions = require('./actions/UserActions');
var MessageActions = require('./actions/MessageActions');


var socket = io();
socket.on('connect', function() {
  socket.on(ACTIONS.ADD_MESSAGE, function(message) {
    MessageActions.addMessage(message);
  });
  socket.on(ACTIONS.ADD_ROOM, function(room) {
    ChatRoomActions.addRoom(room);
  });
  socket.on(ACTIONS.INITIALIZE_STORES, function(initalizationData) {
    SettingActions.setUserFromServer(initalizationData.user);
    ChatRoomActions.setRooms(initalizationData.roomsById);
    UserActions.setUsers(initalizationData.users);
  });
  socket.on(ACTIONS.SET_USERS, function(users) {
    UserActions.setUsers(users);
  });
  socket.on(ACTIONS.UPDATE_USER, function(user) {
    UserActions.updateUser(user);
  });
  socket.on(ACTIONS.ADD_ROOM_SUCCESS, function(room) {
    ChatRoomActions.addRoomSuccess(room);
  });
  socket.on(ACTIONS.UPDATE_MESSAGE, function (message) {
    MessageActions.updateMessage(message);
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

function joinRoom(roomId) {
  socket.emit(ACTIONS.JOIN_ROOM, roomId);
}

function leaveRoom(roomId) {
  socket.emit(ACTIONS.LEAVE_ROOM, roomId);
}

module.exports = {
  submitMessage: submitMessage,
  submitNewRoom: submitNewRoom,
  submitNewUserName: submitNewUserName,
  submitMessageUpdate: submitMessageUpdate,
  submitRoomUpdate: submitRoomUpdate,
  joinRoom: joinRoom,
  leaveRoom: leaveRoom
};
