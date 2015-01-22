'use strict';
var AppDispatcher = require('../AppDispatcher');
var Constants = require('../constants');

var SettingActions = {
  setUserNameFromUI: function(userName) {
    AppDispatcher.dispatch({
      actionType: Constants.SET_USER_NAME_FROM_UI,
      userName: userName
    });
  },
  setUserFromServer: function(user) {
    AppDispatcher.dispatch({
      actionType: Constants.SET_USER_FROM_SERVER,
      user: user
    });
  }
};

module.exports = SettingActions;