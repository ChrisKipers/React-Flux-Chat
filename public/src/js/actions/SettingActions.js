var AppDispatcher = require('../AppDispatcher');
var Constants = require('../constants');

var SettingActions = {
  setUserName: function(userName) {
    AppDispatcher.dispatch({
      actionType: Constants.SET_USER_NAME,
      userName: userName
    });
  }
};

module.exports = SettingActions;