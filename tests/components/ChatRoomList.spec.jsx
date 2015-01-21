var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;
var ChatRoomList = require('../../public/src/js/components/ChatRoomList.jsx');
var $ = require('jquery');

describe('The ChatRoom component', function () {
  var target, targetEl, messagesByRoom, rooms;

  describe('displays', function() {
    it('empty list when there are no rooms', function () {
      rooms = [];
      target = ReactTestUtils.renderIntoDocument(<ChatRoomList rooms={rooms} />);
      targetEl = target.getDOMNode();
      expect($(targetEl).find('li').length).toBe(rooms.length);
    });

    it('rooms when rooms are not empty', function () {
      rooms = ['General', 'Alternative'];
      target = ReactTestUtils.renderIntoDocument(<ChatRoomList rooms={rooms} />);
      targetEl = target.getDOMNode();
      var roomElements = $(targetEl).find('li');

      expect(roomElements.length).toBe(rooms.length);

      for (var i = 0; i < roomElements.length && i < rooms.length; i++) {
        expect(roomElements[i].textContent).toBe(rooms[i]);
      }
    });
  });

  it('triggers a room change event when a room is clicked', function() {
    rooms = ['General', 'Alternative'];
    var changeRoom = jasmine.createSpy('changeRoom');
    target = ReactTestUtils.renderIntoDocument(<ChatRoomList rooms={rooms} onRoomSelect={changeRoom}/>);
    targetEl = target.getDOMNode();
    var firstRoomElement = $(targetEl).find('li')[0];
    ReactTestUtils.Simulate.click(firstRoomElement);

    expect(changeRoom.calls.argsFor(0)[0]).toBe('General');
  });
});