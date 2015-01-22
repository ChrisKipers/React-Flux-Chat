'use strict';
var AppDispatcher = require('../AppDispatcher');
var ACTIONS = require('../constants').ACTIONS;

var UserActions = {
  setUsers: function(users) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.SET_USERS,
      users: users
    });
  }
};

module.exports = UserActions;