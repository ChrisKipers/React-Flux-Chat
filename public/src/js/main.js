/* global document */
var React = require('react');
var App = require('./views/App.jsx');

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);