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
  addPrivateRoom: function (room) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.ADD_PRIVATE_ROOM,
      room: room
    });
  },
  addRoomSuccess: function (room) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.ADD_ROOM_SUCCESS,
      room: room
    });
  },
  setRooms: function (allRooms) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.SET_ROOMS,
      allRooms: allRooms
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