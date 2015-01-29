'use strict';
var ACTIONS = require('../constants').ACTIONS;

var AppDispatcher = require('../AppDispatcher');

var AppActions = {
  toggleNav: function() {
    AppDispatcher.dispatch({
      actionType: ACTIONS.TOGGLE_NAV
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

module.exports = AppActions;