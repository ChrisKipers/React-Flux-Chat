'use strict';
var AppDispatcher = require('../AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ACTIONS = require('../constants').ACTIONS;
var assign = require('object-assign');
var service = require('../service');

var CHANGE_EVENT = 'change';

var _user;

function setUser(user) {
  _user = user;
}

function setUserName(userName) {
  _user.userName = userName;
}

var SettingsStore = assign({}, EventEmitter.prototype, {
  getUser: function () {
    return _user;
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
        setUser(action.user);
        SettingsStore.emitChange();
        break;
      case ACTIONS.SET_USER_NAME_FROM_UI:
        setUserName(action.userName);
        service.submitNewUserName(action.userName);
        break;
      case ACTIONS.UPDATE_USER:
        if (action.user._id === _user._id) {
          setUser(action.user);
          SettingsStore.emitChange();
        }
        break;
      case ACTIONS.JOIN_ROOM:
        service.joinRoom(action.roomId);
        break;
      case ACTIONS.LEAVE_ROOM:
        service.leaveRoom(action.roomId);
        break;
    }

    return true;
  })

});

module.exports = SettingsStore;
