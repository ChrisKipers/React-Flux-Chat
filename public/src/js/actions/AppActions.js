'use strict';
var ACTIONS = require('../constants').ACTIONS;

var AppDispatcher = require('../AppDispatcher');

var AppActions = {
  toggleNav: function() {
    AppDispatcher.dispatch({
      actionType: ACTIONS.TOGGLE_NAV
    });
  }
};

module.exports = AppActions;