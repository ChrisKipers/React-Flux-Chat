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
var MessageStore = require('./MessageStore');

var CHANGE_EVENT = 'change';

var _initialized = false;

var _isNavShowing = !dimensions.isCompact();

var _isSettingsShowing = false;

var _roomStates = [];

var AppStore;

function createNewRoomState(roomId) {
  return {
    roomId: roomId,
    active: false,
    locked: false,
    missedMessages: 0
  };
}

function addStateToNewRoom(roomId) {
  if (!_.find(_roomStates, {roomId: roomId})) {
    _roomStates.push(createNewRoomState(roomId));
  }
}

function setInitialRoomStates(rooms) {
  rooms.map(function (room) {
    return room._id;
  }).forEach(addStateToNewRoom);
}

function toggleNav() {
  _isNavShowing = !_isNavShowing;
  if (_isNavShowing && dimensions.isCompact()) {
    _isSettingsShowing = false;
  }
}

function toggleSettings() {
  _isSettingsShowing = !_isSettingsShowing;
  if (_isSettingsShowing && dimensions.isCompact()) {
    _isNavShowing = false;
  }
}

function enterRoom(roomId) {
  _roomStates.forEach(function (roomState) {
    if (roomState.roomId === roomId) {
      roomState.active = true;
      roomState.missedMessages = 0;
    } else if (!roomState.locked) {
      roomState.active = false;
    }
  });

  if (dimensions.isCompact()) {
    _isNavShowing = false;
    _isSettingsShowing = false;
  }
}

function leaveRoom(roomId) {
  _roomStates = _roomStates.filter(function (roomState) {
    return roomState.roomId !== roomId;
  });
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

  getActiveChatRooms: function () {
    return _roomStates.filter(function (roomState) {
      return roomState.active;
    });
  },

  getChatRoomStates: function () {
    return _roomStates;
  },

  getMode: function () {
    return this.getActiveChatRooms().length > 0 ? APP_MODES.CHAT : APP_MODES.WELCOME;
  },

  isNavShowing: function () {
    return _isNavShowing;
  },

  isSettingsShowing: function () {
    return _isSettingsShowing;
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
        AppDispatcher.waitFor([
          ChatRoomStore.dispatcherIndex,
          UserStore.dispatcherIndex,
          SettingsStore.dispatcherIndex,
          MessageStore.dispatcherIndex
        ]);
        setInitialRoomStates(action.rooms);

        _initialized = true;
        AppStore.emitChange();
        break;
      case ACTIONS.ENTER_ROOM:
        enterRoom(action.roomId);
        AppStore.emitChange();
        break;
      case ACTIONS.JOIN_ROOM_SUCCESS:
        AppDispatcher.waitFor([MessageStore.dispatcherIndex]);
        addStateToNewRoom(action.roomId);
        enterRoom(action.roomId);
        AppStore.emitChange();
        break;
      case ACTIONS.LEAVE_ROOM:
        leaveRoom(action.roomId);
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
        AppDispatcher.waitFor([ChatRoomStore.dispatcherIndex, MessageStore.dispatcherIndex]);
        addStateToNewRoom(action.room._id);
        enterRoom(action.room._id);
        AppStore.emitChange();
        break;
      case ACTIONS.ADD_PRIVATE_ROOM:
        AppDispatcher.waitFor([ChatRoomStore.dispatcherIndex, MessageStore.dispatcherIndex]);
        addStateToNewRoom(action.room._id);
        AppStore.emitChange();
        break;
      case ACTIONS.TOGGLE_NAV:
        toggleNav();
        AppStore.emitChange();
        break;
      case ACTIONS.TOGGLE_SETTINGS:
        toggleSettings();
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