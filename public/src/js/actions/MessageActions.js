var AppDispatcher = require('../AppDispatcher');
var Constants = require('../constants');

var CommentActions = {
  submitMessage: function(message) {
    AppDispatcher.dispatch({
      actionType: Constants.SUBMIT_MESSAGE,
      message: message
    });
  },
  submitRoom: function(roomName) {
    AppDispatcher.dispatch({
      actionType: Constants.SUBMIT_ROOM,
      room: roomName
    });
  },
  addMessage: function(message) {
    AppDispatcher.dispatch({
      actionType: Constants.ADD_MESSAGE,
      message: message
    });
  },
  addRoom: function(roomName) {
    AppDispatcher.dispatch({
      actionType: Constants.ADD_ROOM,
      room: roomName
    });
  },
  setMessages: function(allMessages) {
    AppDispatcher.dispatch({
      actionType: Constants.SET_MESSAGES,
      allMessages: allMessages
    });
  }
};

module.exports = CommentActions;