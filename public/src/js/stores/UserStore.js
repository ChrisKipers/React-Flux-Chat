'use strict';
var AppDispatcher = require('../AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ACTIONS = require('../constants').ACTIONS;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var initialized = false;

var _users = [];

function setUsers(users) {
  _users = users;
}

var UserStore = assign({}, EventEmitter.prototype, {

  isInitialized: function () {
    return initialized;
  },


  getUsers: function () {
    return _users;
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
      case ACTIONS.SET_USERS:
        initialized = true;
        setUsers(action.users);
        UserStore.emitChange();
        break;
    }

    return true;
  })

});

module.exports = UserStore;