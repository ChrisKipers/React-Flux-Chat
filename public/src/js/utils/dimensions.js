'use strict';
/* global window  */
var RESPONSIVE_BREAK_POINTS = require('../constants').RESPONSIVE_BREAK_POINTS;

function isCompact() {
  return window.outerWidth < RESPONSIVE_BREAK_POINTS.MOBILE;
}

module.exports = {
  isCompact: isCompact
};