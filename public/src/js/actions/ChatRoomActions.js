'use strict';
var ACTIONS = require('../constants').ACTIONS;

var AppDispatcher = require('../AppDispatcher');

var ChatRoomActions = {
  submitRoom: function (roomName) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.SUBMIT_ROOM,
      room: roomName
    });
  },
  submitPrivateRoom: function (recipientId) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.SUBMIT_PRIVATE_ROOM,
      recipientId: recipientId
    });
  },
  addRoom: function (room) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.ADD_ROOM,
      room: room
    });
  },
  addPrivateRoom: function (room, messages) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.ADD_PRIVATE_ROOM,
      room: room,
      messages: messages
    });
  },
  addRoomSuccess: function (room, messagesOrUndefined) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.ADD_ROOM_SUCCESS,
      room: room,
      messagesOrUndefined: messagesOrUndefined
    });
  },
  updateRoomFromUI: function (roomId, newName) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.SUBMIT_ROOM_UPDATE,
      name: newName,
      roomId: roomId
    });
  },
  updateRoom: function (room) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.UPDATE_ROOM,
      room: room
    });
  }
};

module.exports = ChatRoomActions;