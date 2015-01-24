'use strict';
var ACTIONS = require('../constants').ACTIONS;

var AppDispatcher = require('../AppDispatcher');

var MessageActions = {
  submitMessage: function(message) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.SUBMIT_MESSAGE,
      message: message
    });
  },
  addMessage: function(message) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.ADD_MESSAGE,
      message: message
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
  }
};

module.exports = MessageActions;