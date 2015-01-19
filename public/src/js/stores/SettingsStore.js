'use strict';
var AppDispatcher = require('../AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants.js');
var assign = require('object-assign');
var service = require('../service');

var CHANGE_EVENT = 'change';

var _userName;

function setUserName(newUserName) {
  _userName = newUserName;
}

var SettingsStore = assign({}, EventEmitter.prototype, {

  getUserName: function() {
    return _userName;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(action) {
    switch(action.actionType) {
      case Constants.SET_USER_NAME_FROM_UI:
          setUserName(action.userName);
          service.submitNewUserName(action.userName);
          SettingsStore.emitChange();
        break;
      case Constants.SET_USER_NAME_FROM_SERVER:
          setUserName(action.userName);
          SettingsStore.emitChange();
        break;
    }

    return true;
  })

});

module.exports = SettingsStore;