'use strict';
var AppDispatcher = require('../AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ACTIONS = require('../constants').ACTIONS;
var assign = require('object-assign');
var service = require('../service');

var CHANGE_EVENT = 'change';

var _user;

var initialized = false;

function setUser(user) {
  _user = user;
}

function setUserName(userName) {
  _user.userName = userName;
}

var SettingsStore = assign({}, EventEmitter.prototype, {

  isInitialized: function () {
    return initialized;
  },

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
      case ACTIONS.SET_USER_NAME_FROM_UI:
        setUserName(action.userName);
        service.submitNewUserName(action.userName);
        SettingsStore.emitChange();
        break;
      case ACTIONS.SET_USER_FROM_SERVER:
        initialized = true;
        setUser(action.user);
        SettingsStore.emitChange();
        break;
    }

    return true;
  })

});

module.exports = SettingsStore;