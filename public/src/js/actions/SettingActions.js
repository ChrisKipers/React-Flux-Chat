'use strict';
var ACTIONS = require('../constants').ACTIONS;

var AppDispatcher = require('../AppDispatcher');

var SettingActions = {
  setUserNameFromUI: function(userName) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.SET_USER_NAME_FROM_UI,
      userName: userName
    });
  },
  setUserFromServer: function(user) {
    AppDispatcher.dispatch({
      actionType: ACTIONS.SET_USER_FROM_SERVER,
      user: user
    });
  }
};

module.exports = SettingActions;