'use strict';
var AppDispatcher = require('../AppDispatcher');
var ACTIONS = require('../constants').ACTIONS;

var MessageActions = {
  submitMessage: function(message) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.SUBMIT_MESSAGE,
      message: message
    });
  },
  submitRoom: function(roomName) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.SUBMIT_ROOM,
      room: roomName
    });
  },
  addMessage: function(message) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.ADD_MESSAGE,
      message: message
    });
  },
  addRoom: function(room) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.ADD_ROOM,
      room: room
    });
  },
  addRoomSuccess: function(room) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.ADD_ROOM_SUCCESS,
      room: room
    });
  },
  setMessages: function(allRooms) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.SET_ROOMS,
      allRooms: allRooms
    });
  },
  updateMessageContentFromUI: function(messageId, roomId, newContent) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.SUBMIT_MESSAGE_UPDATE,
      content: newContent,
      messageId: messageId,
      roomId: roomId
    });
  },
  updateMessage: function(message) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.UPDATE_MESSAGE,
      message: message
    });
  },
  updateRoomFromUI: function(roomId, newName) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.SUBMIT_ROOM_UPDATE,
      name: newName,
      roomId: roomId
    });
  },
  updateRoom: function(room) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.UPDATE_ROOM,
      room: room
    });
  },
  enterRoom: function(roomId) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.ENTER_ROOM,
      roomId: roomId
    });
  },
  lockRoom: function(roomId) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.LOCK_ROOM,
      roomId: roomId
    });
  },
  unlockRoom: function(roomId) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.UNLOCK_ROOM,
      roomId: roomId
    });
  }
};

module.exports = MessageActions;