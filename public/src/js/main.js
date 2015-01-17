var React = require('react');
var App = require('./views/App.jsx');

var myCommentBox = React.render(
  React.createElement(App, null),
  document.getElementById('content')
);