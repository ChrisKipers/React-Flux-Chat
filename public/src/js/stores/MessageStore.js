'use strict';
var AppDispatcher = require('../AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ACTIONS = require('../constants').ACTIONS;
var assign = require('object-assign');
var service = require('../service');

var _ = require('lodash');

var CHANGE_EVENT = 'CHANGE';

var _messagesByRoomId = {};

function setMessages(allMessages) {
  _messagesByRoomId = _.groupBy(allMessages, 'roomId');
}

function addMessage(message) {
  _messagesByRoomId[message.roomId].push(message);
}

function updateMessage(updatedMessage) {
  var messages = _messagesByRoomId[updatedMessage.roomId];
  var messageIndex = _.findIndex(messages, function(message) {
    return message._id === updatedMessage._id;
  });
  _messagesByRoomId[updatedMessage.roomId][messageIndex] = updatedMessage;
}

var MessageStore = assign({}, EventEmitter.prototype, {
  getAllMessages: function () {
    return _messagesByRoomId;
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
      case ACTIONS.INITIALIZE_STORES:
        setMessages(action.messages);
        break;
      case ACTIONS.JOIN_ROOM_SUCCESS:
        _messagesByRoomId[action.roomId] = action.roomMessages;
        MessageStore.emitChange();
        break;
      case ACTIONS.ADD_ROOM_SUCCESS:
        _messagesByRoomId[action.room._id] = action.messagesOrUndefined || [];
        MessageStore.emitChange();
        break;
      case ACTIONS.ADD_PRIVATE_ROOM:
        _messagesByRoomId[action.room._id] = action.messages;
        MessageStore.emitChange();
        break;
      case ACTIONS.ADD_MESSAGE:
        addMessage(action.message);
        MessageStore.emitChange();
        break;
      case ACTIONS.SUBMIT_MESSAGE:
        service.submitMessage(action.message);
        break;
      case ACTIONS.SUBMIT_MESSAGE_UPDATE:
        service.submitMessageUpdate(action.messageId, action.roomId, action.content);
        break;
      case ACTIONS.UPDATE_MESSAGE:
        updateMessage(action.message);
        MessageStore.emitChange();
        break;
    }

    return true;
  })

});

module.exports = MessageStore;
