'use strict';
/* global document */
var React = require('react/addons');
var App = require('./components/App.jsx');

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);