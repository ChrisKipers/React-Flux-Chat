'use strict';
var ACTIONS = require('../constants').ACTIONS;

var AppDispatcher = require('../AppDispatcher');

var UserActions = {
  setUsers: function(users) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.SET_USERS,
      users: users
    });
  },
  updateUser: function(user) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.UPDATE_USER,
      user: user
    });
  }
};

module.exports = UserActions;
