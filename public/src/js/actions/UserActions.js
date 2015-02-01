'use strict';
var ACTIONS = require('../constants').ACTIONS;

var AppDispatcher = require('../AppDispatcher');

var UserActions = {
  updateUser: function(user) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.UPDATE_USER,
      user: user
    });
  }
};

module.exports = UserActions;
