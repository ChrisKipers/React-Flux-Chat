var AppDispatcher = require('../AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants.js');
var assign = require('object-assign');

var generateName = require('sillyname');

var CHANGE_EVENT = 'change';

var _userName = generateName();

/**
 * Create a TODO item.
 * @param {string} text The content of the TODO
 */
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
      case Constants.SET_USER_NAME:
          setUserName(action.userName);
          SettingsStore.emitChange();
        break;
      // add more cases for other actionTypes, like TODO_UPDATE, etc.
    }

    return true; // No errors. Needed by promise in Dispatcher.
  })

});

module.exports = SettingsStore;