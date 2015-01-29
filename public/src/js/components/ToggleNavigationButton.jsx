'use strict';
/*jshint quotmark:false */
var React = require('react');
var cx = require('react/addons').addons.classSet;
var _ = require('lodash');

var NewMessageIndicator = require('./NewMessageIndicator.jsx');

var AppStore = require('../stores/AppStore');

var AppActions = require('../actions/AppActions');

var ToggleNavigationButton = React.createClass({
  getInitialState: function () {
    return {active: AppStore.isNavShowing(), roomStates: AppStore.getChatRoomStates()};
  },
  componentDidMount: function () {
    AppStore.addChangeListener(this._onAppStoreChange);
  },
  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onAppStoreChange);
  },
  _onAppStoreChange: function () {
    this.setState({active: AppStore.isNavShowing(), roomStates: AppStore.getChatRoomStates()});
  },
  render: function () {
    var numberOfMissingMessagesForAllRooms = _.reduce(this.state.roomStates, function(numberOfMissingMessages, roomState) {
      return numberOfMissingMessages + roomState.missedMessages;
    }, 0);

    var classes = cx({
      'list-icon': true,
      active: this.state.active,
      'missing-messages': numberOfMissingMessagesForAllRooms > 0
    });

    return (
      <div className={classes} onClick={AppActions.toggleNav}>
        <NewMessageIndicator missedMessages={numberOfMissingMessagesForAllRooms} />
      </div>
    );
  }
});

module.exports = ToggleNavigationButton;