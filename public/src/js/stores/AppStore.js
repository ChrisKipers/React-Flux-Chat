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

var _activeChatRooms = [];

var AppStore;

function setInitialized() {
  var oldInitialized = _initialized;
  _initialized = ChatRoomStore.isInitialized() && UserStore.isInitialized() && SettingsStore.isInitialized();
  if (oldInitialized !== _initialized) {
    AppStore.emitChange();
  }
}

function enterRoom(roomId) {
  if (!_.find(_activeChatRooms, {roomId: roomId})) {
    _activeChatRooms = _activeChatRooms.filter(function(room) {
      return room.isLocked;
    });
    _activeChatRooms.push({roomId: roomId, isLocked: false});

    if (dimensions.isCompact()) {
      _isNavShowing = false;
    }
  }
}

function lockRoom(roomId) {
  var roomInfo = _.find(_activeChatRooms, {roomId: roomId});
  roomInfo.isLocked = true;
}

function unlockRoom(roomId) {
  _activeChatRooms = _activeChatRooms.filter(function(room) {
    return room.roomId !== roomId;
  });
}

AppStore = assign({}, EventEmitter.prototype, {

  isInitialized: function () {
    return _initialized;
  },

  getActiveChatRooms: function() {
    return _activeChatRooms;
  },

  getMode: function() {
    return _activeChatRooms.length > 0 ? APP_MODES.CHAT : APP_MODES.WELCOME;
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
        setInitialized();
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
        enterRoom(action.room._id);
        AppStore.emitChange();
        break;
      case ACTIONS.TOGGLE_NAV:
        _isNavShowing = !_isNavShowing;
        AppStore.emitChange();
        break;
    }

    return true;
  })

});

module.exports = AppStore;