'use strict';
/*jshint quotmark:false */
var React = require('react/addons');
var cx = React.addons.classSet;

var AppStore = require('../stores/AppStore');

var AppActions = require('../actions/AppActions');

var ToggleSettingsButton = React.createClass({
  getInitialState: function () {
    return {active: AppStore.isSettingsShowing()};
  },
  componentDidMount: function () {
    AppStore.addChangeListener(this._onAppStoreChange);
  },
  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onAppStoreChange);
  },
  _onAppStoreChange: function () {
    this.setState({active: AppStore.isSettingsShowing()});
  },
  render: function () {
    var classes = cx({
      'settings-icon': true,
      active: this.state.active
    });

    return (
      <span className={classes} onClick={AppActions.toggleSettings}></span>
    );
  }
});

module.exports = ToggleSettingsButton;