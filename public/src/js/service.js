'use strict';
var io = require('socket.io-client');

var ACTIONS = require('./constants').ACTIONS;

var ChatRoomActions = require('./actions/ChatRoomActions');
var SettingActions = require('./actions/SettingActions');
var UserActions = require('./actions/UserActions');
var MessageActions = require('./actions/MessageActions');
var AppActions = require('./actions/AppActions');

var _roomsBeingListenToForMessageUpdates = [];

var socket = io();

function registerRoomListeners(targetRoomId) {
  if (_roomsBeingListenToForMessageUpdates.indexOf(targetRoomId) === -1) {
    socket.on(ACTIONS.ADD_MESSAGE + ':' + targetRoomId, MessageActions.addMessage);
    socket.on(ACTIONS.UPDATE_MESSAGE + ':' + targetRoomId, MessageActions.updateMessage);
  }
}

function unregisterRoomListeners(targetRoomId) {
  _roomsBeingListenToForMessageUpdates = _roomsBeingListenToForMessageUpdates.filter(function(roomId) {
    return roomId !== targetRoomId;
  });
  socket.off(ACTIONS.ADD_MESSAGE + ':' + targetRoomId);
  socket.off(ACTIONS.UPDATE_MESSAGE + ':' + targetRoomId);
}

socket.on('connect', function() {
  socket.on(ACTIONS.ADD_ROOM, function(room) {
    ChatRoomActions.addRoom(room);
  });
  socket.on(ACTIONS.INITIALIZE_STORES, function(initalizationData) {
    AppActions.initializeStores(initalizationData);
    initalizationData.user.rooms.forEach(registerRoomListeners);
  });
  socket.on(ACTIONS.UPDATE_USER, function(user) {
    UserActions.updateUser(user);
  });
  socket.on(ACTIONS.UPDATE_ROOM, function (room) {
    ChatRoomActions.updateRoom(room);
  });
  socket.on(ACTIONS.ADD_PRIVATE_ROOM, function(payload, cb) {
    registerRoomListeners(payload.room._id);
    ChatRoomActions.addPrivateRoom(payload.room, payload.messages);
    cb();
  });
});

function submitMessage(message) {
  socket.emit(ACTIONS.SUBMIT_MESSAGE, message);
}

function submitNewRoom(room) {
  socket.emit(ACTIONS.SUBMIT_ROOM, room, function (newRoom) {
    registerRoomListeners(newRoom._id);
    ChatRoomActions.addRoomSuccess(newRoom);
  });
}

function submitPrivateRoom(recipientId) {
  socket.emit(ACTIONS.SUBMIT_PRIVATE_ROOM, recipientId, function (payload) {
    registerRoomListeners(payload.room._id);
    ChatRoomActions.addRoomSuccess(payload.room, payload.messages);
  });
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
  socket.emit(ACTIONS.JOIN_ROOM, roomId, function(joinedMessages) {
    registerRoomListeners(roomId);
    SettingActions.joinRoomSuccess(roomId, joinedMessages);
  });
}

function leaveRoom(roomId) {
  socket.emit(ACTIONS.LEAVE_ROOM, roomId, function() {
    unregisterRoomListeners(roomId);
  });
}

module.exports = {
  submitMessage: submitMessage,
  submitNewRoom: submitNewRoom,
  submitPrivateRoom: submitPrivateRoom,
  submitNewUserName: submitNewUserName,
  submitMessageUpdate: submitMessageUpdate,
  submitRoomUpdate: submitRoomUpdate,
  joinRoom: joinRoom,
  leaveRoom: leaveRoom
};
