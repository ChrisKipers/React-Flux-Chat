'use strict';
var AppDispatcher = require('../AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ACTIONS = require('../constants').ACTIONS;
var assign = require('object-assign');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

var initialized = false;

var _users = [];

function setUsers(users) {
  _users = users;
}

function updateUser(user) {
  var userIndex = _.findIndex(_users, {_id: user._id});
  if (userIndex !== -1) {
    _users[userIndex] = user;
  } else {
    _users.push(user);
  }
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
      case ACTIONS.UPDATE_USER:
        updateUser(action.user);
        UserStore.emitChange();
        break;
    }

    return true;
  })

});

module.exports = UserStore;
