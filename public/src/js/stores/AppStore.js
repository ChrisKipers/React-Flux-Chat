'use strict';
var _ = require('lodash');

var AppDispatcher = require('../AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ACTIONS = require('../constants').ACTIONS;
var APP_MODES = require('../constants').APP_MODES;
var dimensions = require('../utils/dimensions');
var assign = require('object-assign');

var ChatRoomStore = require('./ChatRoomStore');
var UserStore = require('./UserStore');
var SettingsStore = require('./SettingsStore');

var CHANGE_EVENT = 'change';

var _initialized = false;

var _isNavShowing = true;

var _roomStates = [];

var AppStore;

function setInitialized() {
  var oldInitialized = _initialized;
  _initialized = ChatRoomStore.isInitialized() && UserStore.isInitialized() && SettingsStore.isInitialized();
  if (oldInitialized !== _initialized) {
    AppStore.emitChange();
  }
}

function createNewRoomState(room) {
  return {
    roomId: room._id,
    active: false,
    locked: false,
    missedMessages: 0
  };
}

function initializeRoomState(rooms) {
  _roomStates = rooms.map(createNewRoomState);

}

function addStateToNewRoom(newRoom) {
  _roomStates.push(createNewRoomState(newRoom));
}

function enterRoom(roomId) {
  _roomStates.forEach(function(roomState) {
    if (roomState.roomId === roomId) {
      roomState.active = true;
      roomState.missedMessages = 0;
    } else if (!roomState.locked) {
      roomState.active = false;
    }
  });

  if (dimensions.isCompact()) {
    _isNavShowing = false;
  }
}

function lockRoom(roomId) {
  var roomState = _.find(_roomStates, {roomId: roomId});
  roomState.locked = true;
}

function unlockRoom(roomId) {
  var roomState = _.find(_roomStates, {roomId: roomId});
  roomState.locked = false;
  roomState.active = false;
}

AppStore = assign({}, EventEmitter.prototype, {

  isInitialized: function () {
    return _initialized;
  },

  getActiveChatRooms: function() {
    return _roomStates.filter(function(roomState) {
      return roomState.active;
    });
  },

  getChatRoomStates: function() {
    return _roomStates;
  },

  getMode: function() {
    return this.getActiveChatRooms().length > 0 ? APP_MODES.CHAT : APP_MODES.WELCOME;
  },

  isNavShowing: function () {
    return _isNavShowing;
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
      case ACTIONS.SET_ROOMS:
        AppDispatcher.waitFor([ChatRoomStore.dispatcherIndex]);
        initializeRoomState(action.allRooms);
        setInitialized();
        break;
      case ACTIONS.ADD_ROOM:
        AppDispatcher.waitFor([ChatRoomStore.dispatcherIndex]);
        addStateToNewRoom(action.room);
        AppStore.emitChange();
        break;
      case ACTIONS.SET_USERS:
        AppDispatcher.waitFor([UserStore.dispatcherIndex]);
        setInitialized();
        break;
      case ACTIONS.SET_USER_FROM_SERVER:
        AppDispatcher.waitFor([SettingsStore.dispatcherIndex]);
        setInitialized();
        break;
      case ACTIONS.ENTER_ROOM:
        enterRoom(action.roomId);
        AppStore.emitChange();
        break;
      case ACTIONS.LOCK_ROOM:
        lockRoom(action.roomId);
        AppStore.emitChange();
        break;
      case ACTIONS.UNLOCK_ROOM:
        unlockRoom(action.roomId);
        AppStore.emitChange();
        break;
      case ACTIONS.ADD_ROOM_SUCCESS:
        AppDispatcher.waitFor([ChatRoomStore.dispatcherIndex]);
        addStateToNewRoom(action.room);
        enterRoom(action.room._id);
        AppStore.emitChange();
        break;
      case ACTIONS.TOGGLE_NAV:
        _isNavShowing = !_isNavShowing;
        AppStore.emitChange();
        break;
      case ACTIONS.ADD_MESSAGE:
        AppDispatcher.waitFor([ChatRoomStore.dispatcherIndex]);
        var roomState = _.find(_roomStates, {roomId: action.message.roomId});
        if (!roomState.active) {
          roomState.missedMessages++;
          AppStore.emitChange();
        }
        break;
    }

    return true;
  })

});

module.exports = AppStore;