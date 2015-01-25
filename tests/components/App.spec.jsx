var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;
var $ = require('jquery');
var _ = require('lodash');

var APP_MODES = require('../../public/src/js/constants').APP_MODES;

var App = require('../../public/src/js/components/App.jsx');

// Composite components that we will be checking for inclusion of
var AppHeader = require('../../public/src/js/components/AppHeader.jsx');
var LoadingScreen = require('../../public/src/js/components/LoadingScreen.jsx');
var ChatRoomManager = require('../../public/src/js/components/ChatRoomManager.jsx');
var WelcomePanel = require('../../public/src/js/components/WelcomePanel.jsx');

var AppStore = require('../../public/src/js/stores/AppStore');
var SettingsStore = require('../../public/src/js/stores/SettingsStore');

var TestData = require('../test-data');


describe('The App component', function () {
  var target, targetEl;

  describe('is not initialized', function() {
    beforeEach(function() {
      spyOn(AppStore, 'isInitialized').and.returnValue(false);
      target = ReactTestUtils.renderIntoDocument(<App />);
      targetEl = target.getDOMNode();
    });

    it('it renders the application header', function() {
      expect(ReactTestUtils.findRenderedComponentWithType(target, AppHeader)).toBeTruthy();
    });

    it('it renders the loading screen', function () {
      expect(ReactTestUtils.findRenderedComponentWithType(target, LoadingScreen)).toBeTruthy();
    });

    it('it does not render the chat manager', function () {
      expect(ReactTestUtils.scryRenderedComponentsWithType(target, ChatRoomManager).length).toBe(0);
    });

    it('it does not render the welcome panel', function () {
      expect(ReactTestUtils.scryRenderedComponentsWithType(target, WelcomePanel).length).toBe(0);
    });
  });

  describe('is initialized and in WELCOME mode', function() {
    beforeEach(function() {
      spyOn(AppStore, 'isInitialized').and.returnValue(true);
      spyOn(AppStore, 'getMode').and.returnValue(APP_MODES.WELCOME);
      spyOn(SettingsStore, 'getUser').and.returnValue(TestData.getTestUser());
      target = ReactTestUtils.renderIntoDocument(<App />);
      targetEl = target.getDOMNode();
    });

    it('it renders the application header', function() {
      expect(ReactTestUtils.findRenderedComponentWithType(target, AppHeader)).toBeTruthy();
    });

    it('it does not render the loading screen', function () {
      expect(ReactTestUtils.scryRenderedComponentsWithType(target, LoadingScreen).length).toBe(0);
    });

    it('it does not render the chat manager', function () {
      expect(ReactTestUtils.scryRenderedComponentsWithType(target, ChatRoomManager).length).toBe(0);
    });

    it('it renders the welcome panel', function () {
      expect(ReactTestUtils.findRenderedComponentWithType(target, WelcomePanel)).toBeTruthy();
    });
  });

  describe('is initialized and in CHAT mode', function() {
    beforeEach(function() {
      spyOn(AppStore, 'isInitialized').and.returnValue(true);
      spyOn(AppStore, 'getMode').and.returnValue(APP_MODES.CHAT);
      target = ReactTestUtils.renderIntoDocument(<App />);
      targetEl = target.getDOMNode();
    });

    it('it renders the application header', function() {
      expect(ReactTestUtils.findRenderedComponentWithType(target, AppHeader)).toBeTruthy();
    });

    it('it does not render the loading screen', function () {
      expect(ReactTestUtils.scryRenderedComponentsWithType(target, LoadingScreen).length).toBe(0);
    });

    it('it renders the chat manager', function () {
      expect(ReactTestUtils.findRenderedComponentWithType(target, ChatRoomManager)).toBeTruthy();
    });

    it('it does not render the welcome panel', function () {
      expect(ReactTestUtils.scryRenderedComponentsWithType(target, WelcomePanel).length).toBe(0);
    });
  });
});