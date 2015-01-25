var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;
var $ = require('jquery');
var _ = require('lodash');

var ChatRoomList = require('../../public/src/js/components/ChatRoomList.jsx');

var ChatRoomStore = require('../../public/src/js/stores/ChatRoomStore');

var ChatRoomActions = require('../../public/src/js/actions/ChatRoomActions');


var TestData = require('../test-data');

describe('The ChatRoomList component', function () {
  var target, targetEl, rooms;

  describe('displays', function () {
    it('empty list when there are no rooms', function () {
      rooms = {};
      spyOn(ChatRoomStore, 'getAll').and.returnValue(rooms);
      target = ReactTestUtils.renderIntoDocument(<ChatRoomList />);
      targetEl = target.getDOMNode();
      expect($(targetEl).find('li').length).toBe(_.values(rooms).length);
    });

    it('rooms when rooms are not empty', function () {
      var roomOne = TestData.getTestRoom('1'), roomTwo = TestData.getTestRoom('2');
      rooms = {};
      rooms[roomOne._id] = roomOne;
      rooms[roomTwo._id] = roomTwo;
      spyOn(ChatRoomStore, 'getAll').and.returnValue(rooms);
      target = ReactTestUtils.renderIntoDocument(<ChatRoomList />);
      targetEl = target.getDOMNode();
      var roomElements = $(targetEl).find('li');

      var roomValues = _.values(rooms);

      expect(roomElements.length).toBe(roomValues.length);

      for (var i = 0; i < roomElements.length && i < roomValues.length; i++) {
        expect(roomElements[i].textContent).toBe(roomValues[i].name);
      }
    });
  });

  describe('triggers an event', function () {
    var roomValues, roomOne, roomTwo;
    beforeEach(function() {
      roomOne = TestData.getTestRoom('1'), roomTwo = TestData.getTestRoom('2');
      rooms = {};
      rooms[roomOne._id] = roomOne;
      rooms[roomTwo._id] = roomTwo;
      roomValues = _.values(rooms);

      spyOn(ChatRoomStore, 'getAll').and.returnValue(rooms);

      target = ReactTestUtils.renderIntoDocument(<ChatRoomList />);
      targetEl = target.getDOMNode();
    });

    it('to enter a room on click', function () {
      spyOn(ChatRoomActions, 'enterRoom');
      var firstRoomElement = $(targetEl).find('li')[0];
      ReactTestUtils.Simulate.click(firstRoomElement);
      expect(ChatRoomActions.enterRoom.calls.count()).toBe(1);
      expect(ChatRoomActions.enterRoom.calls.argsFor(0)[0]).toBe(roomOne._id);
    });

    it('to lock a room on double click', function () {
      spyOn(ChatRoomActions, 'lockRoom');
      var firstRoomElement = $(targetEl).find('li')[0];
      ReactTestUtils.Simulate.doubleClick(firstRoomElement);
      expect(ChatRoomActions.lockRoom.calls.count()).toBe(1);
      expect(ChatRoomActions.lockRoom.calls.argsFor(0)[0]).toBe(roomOne._id);
    });
  });
});