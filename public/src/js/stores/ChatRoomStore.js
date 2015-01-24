'use strict';
var AppDispatcher = require('../AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ACTIONS = require('../constants').ACTIONS;
var assign = require('object-assign');
var service = require('../service');

var _ = require('lodash');

var events = {
  CHANGE: 'CHANGE'
};

var initialized = false;

var _roomById = {};

function addRoom(room) {
  _roomById[room._id] = room;
}

function updateRoom(room) {
  _roomById[room._id] = room;
}

function addMessage(message) {
  _roomById[message.roomId].messages.push(message);
}

function updateMessage(updatedMessage) {
  var room = _roomById[updatedMessage.roomId];
  var messageIndex = _.findIndex(room.messages, function(message) {
    return message._id === updatedMessage._id;
  });
  room.messages[messageIndex] = updatedMessage;
}

function setRooms(allRoomsById) {
  _roomById = allRoomsById;
}

var ChatRoomStore = assign({}, EventEmitter.prototype, {

  isInitialized: function () {
    return initialized;
  },

  getAll: function () {
    return _roomById;
  },

  emitChange: function () {
    this.emit(events.CHANGE);
  },

  dispatcherIndex: AppDispatcher.register(function (action) {
    switch (action.actionType) {
      case ACTIONS.ADD_MESSAGE:
        addMessage(action.message);
        ChatRoomStore.emitChange();
        break;
      case ACTIONS.ADD_ROOM:
        addRoom(action.room);
        ChatRoomStore.emitChange();
        break;
      case ACTIONS.SUBMIT_MESSAGE:
        service.submitMessage(action.message);
        break;
      case ACTIONS.SUBMIT_ROOM:
        service.submitNewRoom(action.room);
        break;
      case ACTIONS.SET_ROOMS:
        initialized = true;
        setRooms(action.allRooms);
        ChatRoomStore.emitChange();
        break;
      case ACTIONS.ADD_ROOM_SUCCESS:
        addRoom(action.room);
        ChatRoomStore.emitChange();
        break;
      case ACTIONS.SUBMIT_MESSAGE_UPDATE:
        service.submitMessageUpdate(action.messageId, action.roomId, action.content);
        break;
      case ACTIONS.UPDATE_MESSAGE:
        updateMessage(action.message);
        ChatRoomStore.emitChange();
        break;
      case ACTIONS.SUBMIT_ROOM_UPDATE:
        service.submitRoomUpdate(action.roomId, action.name);
        break;
      case ACTIONS.UPDATE_ROOM:
        updateRoom(action.room);
        ChatRoomStore.emitChange();
        break;
    }

    return true;
  })

});

ChatRoomStore.events = events;

module.exports = ChatRoomStore;