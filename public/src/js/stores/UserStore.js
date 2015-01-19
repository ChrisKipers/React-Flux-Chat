'use strict';
var AppDispatcher = require('../AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants.js');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _users = [];

function setUsers(users) {
  _users = users;
}

var UserStore = assign({}, EventEmitter.prototype, {

  getUsers: function() {
    return _users;
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
      case Constants.SET_USERS:
          setUsers(action.users);
          UserStore.emitChange();
        break;
    }

    return true;
  })

});

module.exports = UserStore;