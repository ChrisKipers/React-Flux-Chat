var AppDispatcher = require('../AppDispatcher');
var Constants = require('../constants');

var UserActions = {
  setUsers: function(users) {
    AppDispatcher.dispatch({
      actionType: Constants.SET_USERS,
      users: users
    });
  }
};

module.exports = UserActions;