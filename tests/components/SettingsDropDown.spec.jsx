var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;

var SettingsDropDown = require('../../public/src/js/components/SettingsDropDown.jsx');
var SettingsStore = require('../../public/src/js/stores/SettingsStore');
var SettingActions = require('../../public/src/js/actions/SettingActions');

var $ = require('jquery');

describe('The SettingsDropDown component', function () {
  var target, targetEl, inputEl, onCloseSpy, user = {
    userName: 'Test User',
    _id: '1'
  };
  beforeEach(function () {
    spyOn(SettingsStore, 'getUser').and.returnValue(user);
    spyOn(SettingActions, 'setUserNameFromUI');
    onCloseSpy = jasmine.createSpy('onCloseSpy');

    target = ReactTestUtils.renderIntoDocument(<SettingsDropDown onClose={onCloseSpy} />);
    targetEl = target.getDOMNode();
    inputEl = target.refs.userNameInput.getDOMNode();
  });

  it('is initialized with the user name from the settings store', function () {
    expect(inputEl.value).toBe(user.userName);
  });

  it('triggers a close event when the close button is clicked', function () {
    var closeButton = $(targetEl).find('.close-botton')[0];
    ReactTestUtils.Simulate.click(closeButton);
    expect(onCloseSpy.calls.any()).toBeTruthy();
  });

  describe('submitting the form', function () {
    var formEl;

    beforeEach(function () {
      formEl = $(targetEl).find('form')[0];
    });

    describe('with invalid input', function () {
      beforeEach(function () {
        ReactTestUtils.Simulate.change(inputEl, {target: {value: ''}});
        ReactTestUtils.Simulate.submit(formEl);
      });

      it('doesn\'t submit a username', function () {
        expect(SettingActions.setUserNameFromUI.calls.any()).toBeFalsy();
      });

      it('doesn\'t triggers a close event', function () {
        expect(onCloseSpy.calls.any()).toBeFalsy();
      });
    });

    describe('with valid input', function () {
      var newUserName;
      beforeEach(function () {
        newUserName = 'New Test User Name';
        ReactTestUtils.Simulate.change(inputEl, {target: {value: newUserName}});
        ReactTestUtils.Simulate.submit(formEl);
      });

      it('submits a username', function () {
        expect(SettingActions.setUserNameFromUI.calls.any()).toBeTruthy();
        expect(SettingActions.setUserNameFromUI.calls.argsFor(0)[0]).toBe(newUserName);
      });

      it('triggers a close event', function () {
        expect(onCloseSpy.calls.any()).toBeTruthy();
      });
    });
  });


  describe('clicking the save button', function () {
    var saveBtnEl;
    beforeEach(function () {
      saveBtnEl = $(targetEl).find('.dialog-footer input[type="button"]')[0];
    });

    describe('with invalid input', function () {
      beforeEach(function () {
        ReactTestUtils.Simulate.change(inputEl, {target: {value: ''}});
        ReactTestUtils.Simulate.click(saveBtnEl);
      });

      it('doesn\'t submit a username', function () {
        expect(SettingActions.setUserNameFromUI.calls.any()).toBeFalsy();
      });

      it('doesn\'t triggers a close event', function () {
        expect(onCloseSpy.calls.any()).toBeFalsy();
      });
    });

    describe('with valid input', function () {
      var newUserName;
      beforeEach(function () {
        newUserName = 'New Test User Name';
        ReactTestUtils.Simulate.change(inputEl, {target: {value: newUserName}});
        ReactTestUtils.Simulate.click(saveBtnEl);
      });

      it('submits a username', function () {
        expect(SettingActions.setUserNameFromUI.calls.any()).toBeTruthy();
        expect(SettingActions.setUserNameFromUI.calls.argsFor(0)[0]).toBe(newUserName);
      });

      it('triggers a close event', function () {
        expect(onCloseSpy.calls.any()).toBeTruthy();
      });
    });
  });
});