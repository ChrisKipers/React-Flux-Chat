'use strict';
var AppDispatcher = require('../AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ACTIONS = require('../constants').ACTIONS;
var assign = require('object-assign');
var service = require('../service');

var _ = require('lodash');

var CHANGE_EVENT = 'CHANGE';

var _roomById = {};

function addRoom(room) {
  _roomById[room._id] = _roomById[room._id] || room;
}

function updateRoom(updatedRoom) {
  var existingRoom = _roomById[updatedRoom._id];
  _roomById[updatedRoom._id] = _.extend(existingRoom, updatedRoom);
}

function setRooms(allRooms) {
  _roomById = _.indexBy(allRooms, '_id');
}

var ChatRoomStore = assign({}, EventEmitter.prototype, {
  getAll: function () {
    return _roomById;
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
        setRooms(action.rooms);
        ChatRoomStore.emitChange();
        break;
      case ACTIONS.ADD_ROOM:
        addRoom(action.room);
        ChatRoomStore.emitChange();
        break;
      case ACTIONS.ADD_PRIVATE_ROOM:
        addRoom(action.room);
        ChatRoomStore.emitChange();
        break;
      case ACTIONS.SUBMIT_ROOM:
        service.submitNewRoom(action.room);
        break;
      case ACTIONS.SUBMIT_PRIVATE_ROOM:
        service.submitPrivateRoom(action.recipientId);
        break;
      case ACTIONS.ADD_ROOM_SUCCESS:
        addRoom(action.room);
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

module.exports = ChatRoomStore;
