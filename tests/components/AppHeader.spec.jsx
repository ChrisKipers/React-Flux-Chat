var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;
var $ = require('jquery');

var AppHeader = require('../../public/src/js/components/AppHeader.jsx');
var SettingsDropdown = require('../../public/src/js/components/SettingsDropdown.jsx');

var SettingsStore = require('../../public/src/js/stores/SettingsStore');

var TestData = require('../test-data');

describe('The AppHeader component', function () {
  var target, targetEl;
  beforeEach(function () {
    spyOn(SettingsStore, 'getUser').and.returnValue(TestData.getTestUser());
    target = ReactTestUtils.renderIntoDocument(<AppHeader />);
    targetEl = target.getDOMNode();
  });

  describe('displays', function () {
    it('the title', function () {
      expect($(targetEl).find('.title').text()).toBe('React + Flux Chat');
    });

    it('a settings icon', function () {
      expect($(targetEl).find('.settings-icon').length).toBe(1);
    });
  });

  it('is initialized with the settings drop down closed', function () {
    expect(isSettingsDropDownOpen()).toBe(false);
  });

  it('opens the settings drop down with the settings icon is clicked and the settings drop down was closed', function () {
    clickSettingsIcon();
    expect(isSettingsDropDownOpen()).toBe(true);
  });

  it('closes the settings drop down with the settings icon is clicked and the settings drop down was open', function () {
    clickSettingsIcon();
    expect(isSettingsDropDownOpen()).toBe(true);
    clickSettingsIcon();
    expect(isSettingsDropDownOpen()).toBe(false);
  });

  function isSettingsDropDownOpen() {
    return ReactTestUtils.scryRenderedComponentsWithType(target, SettingsDropdown).length === 1;
  }

  function clickSettingsIcon() {
    var settingsIcon = $(targetEl).find('.settings-icon')[0];
    ReactTestUtils.Simulate.click(settingsIcon);
  }
});