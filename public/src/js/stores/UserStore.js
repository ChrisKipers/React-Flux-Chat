var AppDispatcher = require('../AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants.js');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _users = [];

/**
 * Create a TODO item.
 * @param {string} text The content of the TODO
 */
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

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(action) {
    switch(action.actionType) {
      case Constants.SET_USERS:
          setUsers(action.users);
          UserStore.emitChange();
        break;
      // add more cases for other actionTypes, like TODO_UPDATE, etc.
    }

    return true; // No errors. Needed by promise in Dispatcher.
  })

});

module.exports = UserStore;