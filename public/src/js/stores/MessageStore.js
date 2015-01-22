'use strict';
var AppDispatcher = require('../AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ACTIONS = require('../constants').ACTIONS;
var assign = require('object-assign');
var service = require('../service');

var CHANGE_EVENT = 'change';

var _messagesByRoom = {
  General: []
};

function addRoom(roomName) {
  _messagesByRoom[roomName] = _messagesByRoom[roomName] || [];
}

function addMessage(message, roomName) {
  addRoom(roomName);
  _messagesByRoom[roomName].push(message);
}

function setAllMessages(allMessages) {
  _messagesByRoom = allMessages;
}

var MessageStore = assign({}, EventEmitter.prototype, {

  getAll: function () {
    return _messagesByRoom;
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function (action) {
    switch (action.actionType) {
      case ACTIONS.ADD_MESSAGE:
        addMessage(action.message, action.message.room);
        MessageStore.emitChange();
        break;
      case ACTIONS.ADD_ROOM:
        addRoom(action.room);
        MessageStore.emitChange();
        break;
      case ACTIONS.SUBMIT_MESSAGE:
        service.submitMessage(action.message);
        break;
      case ACTIONS.SUBMIT_ROOM:
        service.submitNewRoom(action.room);
        break;
      case ACTIONS.SET_MESSAGES:
        setAllMessages(action.allMessages);
        MessageStore.emitChange();
        break;
    }

    return true;
  })

});

module.exports = MessageStore;