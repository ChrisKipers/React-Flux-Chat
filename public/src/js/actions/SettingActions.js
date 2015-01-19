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
  setUserNameFromServer: function(userName) {
    AppDispatcher.dispatch({
      actionType: Constants.SET_USER_NAME_FROM_SERVER,
      userName: userName
    });
  }
};

module.exports = SettingActions;