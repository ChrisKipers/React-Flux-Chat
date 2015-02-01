'use strict';
var ACTIONS = require('../constants').ACTIONS;

var AppDispatcher = require('../AppDispatcher');

var SettingActions = {
  setUserNameFromUI: function(userName) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.SET_USER_NAME_FROM_UI,
      userName: userName
    });
  },
  joinRoom: function(roomId) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.JOIN_ROOM,
      roomId: roomId
    });
  },
  joinRoomSuccess: function(roomId, roomMessages) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.JOIN_ROOM_SUCCESS,
      roomId: roomId,
      roomMessages: roomMessages
    });
  },
  leaveRoom: function(roomId) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.LEAVE_ROOM,
      roomId: roomId
    });
  }
};

module.exports = SettingActions;