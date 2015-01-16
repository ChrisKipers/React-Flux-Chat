var AppDispatcher = require('../AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants.js');
var assign = require('object-assign');
var _ = require('lodash');
var service = require('../service');

var CHANGE_EVENT = 'change';

var _messagesByRoom = {
  general: []
}; // collection of todo items

/**
 * Create a TODO item.
 * @param {string} text The content of the TODO
 */
function addMessage(message, roomName) {
  addRoom(roomName);
  _messagesByRoom[roomName].push(message);
}

function addRoom(roomName) {
  _messagesByRoom[roomName] = _messagesByRoom[roomName] || [];
}

function setAllMessages(allMessages) {
  _messagesByRoom = allMessages;
}


var MessageStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    return _messagesByRoom;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(action) {
    switch(action.actionType) {
      case Constants.ADD_MESSAGE:
          addMessage(action.message, action.message.room);
          MessageStore.emitChange();
        break;
      case Constants.ADD_ROOM:
          addRoom(action.room);
          MessageStore.emitChange();
        break;
      case Constants.SUBMIT_MESSAGE:
          service.submitMessage(action.message);
        break;
      case Constants.SUBMIT_ROOM:
          service.submitNewRoom(action.room);
        break;
      case Constants.SET_MESSAGES:
          setAllMessages(action.allMessages);
          MessageStore.emitChange();
        break;

      // add more cases for other actionTypes, like TODO_UPDATE, etc.
    }

    return true; // No errors. Needed by promise in Dispatcher.
  })

});

module.exports = MessageStore;