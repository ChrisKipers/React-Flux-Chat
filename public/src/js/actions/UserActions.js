'use strict';
var ACTIONS = require('../constants').ACTIONS;

var AppDispatcher = require('../AppDispatcher');

var UserActions = {
  setUsers: function(users) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.SET_USERS,
      users: users
    });
  }
};

module.exports = UserActions;