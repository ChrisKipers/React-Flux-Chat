var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;
var CreateRoomInput = require('../../public/src/js/components/CreateRoomInput.jsx');
var $ = require('jquery');

describe('The ChatRoom component', function () {
  var target, targetEl, submitRoomSpy;

  beforeEach(function() {
    submitRoomSpy = jasmine.createSpy('submitRoomSpy');
    target = ReactTestUtils.renderIntoDocument(<CreateRoomInput onSubmit={submitRoomSpy} />);
    targetEl = target.getDOMNode();
  });

  describe('in display mode', function() {
    it('displays the text "Create Room"', function() {
      expect(targetEl.textContent).toBe('Create Room');
    });

    it('enters edit mode when clicked', function() {
      var clickTarget = $(targetEl).find('> div')[0];
      ReactTestUtils.Simulate.click(clickTarget);
      expect(target.state.editing).toBeTruthy();
    });
  });

  describe('in edit mode', function() {
    var inputFieldEl, formEl;

    beforeEach(function() {
      target.setState({editing: true});
      inputFieldEl = $(targetEl).find('input[type="text"]')[0];
      formEl = $(targetEl).find('form')[0];
    });

    it('displays one text input', function() {
      expect(inputFieldEl).toBeTruthy();
    });

    it('does not create a room with an empty name', function() {
      ReactTestUtils.Simulate.submit(formEl);
      expect(submitRoomSpy.calls.any()).toBeFalsy();
    });

    it('does create a room with name', function() {
      var newRoomName = 'New Room!';
      ReactTestUtils.Simulate.change(inputFieldEl, {target: {value: newRoomName}});
      ReactTestUtils.Simulate.submit(formEl);
      expect(submitRoomSpy.calls.argsFor(0)[0]).toBe(newRoomName);
    });

    describe('exits edit mode', function() {
      it('after create a new room', function() {
        ReactTestUtils.Simulate.change(inputFieldEl, {target: {value: 'New Room'}});
        ReactTestUtils.Simulate.submit(formEl);
        expect(target.state.editing).toBeFalsy();
      });

      it('after escape key is pressed', function() {
        ReactTestUtils.Simulate.keyDown(inputFieldEl, {keyCode: 27});
        expect(target.state.editing).toBeFalsy();
      });

      it('after blur event on input', function() {
        ReactTestUtils.Simulate.blur(inputFieldEl);
        expect(target.state.editing).toBeFalsy();
      });
    });
  });
});