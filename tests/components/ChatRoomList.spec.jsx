var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;
var ChatRoomList = require('../../public/src/js/components/ChatRoomList.jsx');
var $ = require('jquery');

var TestData = require('../test-data');

describe('The ChatRoomList component', function () {
  var target, targetEl, messagesByRoom, rooms;

  describe('displays', function () {
    it('empty list when there are no rooms', function () {
      rooms = [];
      target = ReactTestUtils.renderIntoDocument(<ChatRoomList rooms={rooms} />);
      targetEl = target.getDOMNode();
      expect($(targetEl).find('li').length).toBe(rooms.length);
    });

    it('rooms when rooms are not empty', function () {
      rooms = [TestData.getTestRoom('1'), TestData.getTestRoom('2')];
      target = ReactTestUtils.renderIntoDocument(<ChatRoomList rooms={rooms} />);
      targetEl = target.getDOMNode();
      var roomElements = $(targetEl).find('li');

      expect(roomElements.length).toBe(rooms.length);

      for (var i = 0; i < roomElements.length && i < rooms.length; i++) {
        expect(roomElements[i].textContent).toBe(rooms[i].name);
      }
    });
  });

  it('triggers a room change event when a room is clicked', function () {
    var roomOne = TestData.getTestRoom('1');
    rooms = [roomOne, TestData.getTestRoom('2')];
    var changeRoom = jasmine.createSpy('changeRoom');
    target = ReactTestUtils.renderIntoDocument(<ChatRoomList rooms={rooms} onRoomSelect={changeRoom}/>);
    targetEl = target.getDOMNode();
    var firstRoomElement = $(targetEl).find('li')[0];
    ReactTestUtils.Simulate.click(firstRoomElement);

    expect(changeRoom.calls.argsFor(0)[0]).toBe(roomOne);
  });
});