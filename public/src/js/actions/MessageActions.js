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
  addRoom: function(roomName) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.ADD_ROOM,
      room: roomName
    });
  },
  setMessages: function(allMessages) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.SET_MESSAGES,
      allMessages: allMessages
    });
  }
};

module.exports = MessageActions;