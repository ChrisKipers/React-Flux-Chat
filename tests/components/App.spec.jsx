var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;
var $ = require('jquery');
var TestData = require('../test-data');
var _ = require('lodash');

var App = require('../../public/src/js/components/App.jsx');

// Composite components that we will be checking for inclusion of
var AppHeader = require('../../public/src/js/components/AppHeader.jsx');
var ChatRoomList = require('../../public/src/js/components/ChatRoomList.jsx');
var CreateRoomInput = require('../../public/src/js/components/CreateRoomInput.jsx');
var UserList = require('../../public/src/js/components/UserList.jsx');
var ChatRoom = require('../../public/src/js/components/ChatRoom.jsx');

var SettingsStore = require('../../public/src/js/stores/SettingsStore');
var ChatRoomStore = require('../../public/src/js/stores/ChatRoomStore');
var UserStore = require('../../public/src/js/stores/UserStore');

var ChatRoomActions = require('../../public/src/js/actions/ChatRoomActions');

describe('The App component', function () {
  var target, targetEl, user, users, rooms;

  beforeEach(function () {
    users = TestData.getNTestUsers(3);
    user = users[0];
    var testRoom = TestData.getTestRoom(user._id);
    rooms = {};
    rooms[testRoom._id] = testRoom;

    spyOn(SettingsStore, 'isInitialized').and.returnValue(true);
    spyOn(ChatRoomStore, 'isInitialized').and.returnValue(true);
    spyOn(UserStore, 'isInitialized').and.returnValue(true);

    spyOn(SettingsStore, 'getUser').and.callFake(function() {
      return user;
    });
    spyOn(ChatRoomStore, 'getAll').and.callFake(function() {
      return rooms;
    });
    spyOn(UserStore, 'getUsers').and.callFake(function() {
      return users;
    });

    target = ReactTestUtils.renderIntoDocument(<App />);
    targetEl = target.getDOMNode();
  });

  describe('has an AppHeader component', function() {
    var appHeaderComponent;
    beforeEach(function() {
      appHeaderComponent = ReactTestUtils.findRenderedComponentWithType(target, AppHeader);
    });

    it('is rendered', function() {
      expect(appHeaderComponent).toBeTruthy();
    });
  });


  describe('has an ChatRoomList component', function() {
    var chatRoomListComponent;
    beforeEach(function() {
      chatRoomListComponent = ReactTestUtils.findRenderedComponentWithType(target, ChatRoomList);
    });

    it('is rendered', function() {
      expect(chatRoomListComponent).toBeTruthy();
    });

    it('is passed the correct rooms', function () {
      var roomValues = _.values(target.state.roomsById);
      expect(chatRoomListComponent.props.rooms).toEqual(roomValues);
    });

    it('is passed the correct onRoomSelect handler', function () {
      expect(chatRoomListComponent.props.onRoomSelect).toEqual(target._changeRoom);
    });
  });

  describe('has an CreateRoomInput component', function() {
    var createRoomInputComponent;
    beforeEach(function() {
      createRoomInputComponent = ReactTestUtils.findRenderedComponentWithType(target, CreateRoomInput);
    });

    it('is rendered', function() {
      expect(createRoomInputComponent).toBeTruthy();
    });

    it('is passed the correct onSubmit handler', function () {
      expect(createRoomInputComponent.props.onSubmit).toEqual(target._createNewChatRoom);
    });
  });

  describe('has an UserList component', function() {
    var userListComponent;
    beforeEach(function() {
      userListComponent = ReactTestUtils.findRenderedComponentWithType(target, UserList);
    });

    it('is rendered', function() {
      expect(userListComponent).toBeTruthy();
    });

    it('is passed the correct users property', function () {
      var usersInApp = _.values(target.state.usersById);
      expect(userListComponent.props.users).toEqual(usersInApp);
    });
  });

  describe('has an ChatRoom component', function() {
    var chatRoomComponent;
    beforeEach(function() {
      chatRoomComponent = ReactTestUtils.findRenderedComponentWithType(target, ChatRoom);
    });

    it('is rendered', function() {
      expect(chatRoomComponent).toBeTruthy();
    });

    it('is passed the correct room property', function () {
      var currentRoom = target.state.roomsById[target.state.room];
      var roomWithUserData = target._mergeRoomWithUserData(currentRoom);
      expect(chatRoomComponent.props.room).toEqual(roomWithUserData);
    });

    it('is passed the correct user property', function () {
      expect(chatRoomComponent.props.user).toEqual(target.state.user);
    });
  });

  describe('responds to ChatRoomStore updates', function() {
    beforeEach(function() {
      var newTestRoom = TestData.getTestRoom(target.state.user._id);
      rooms = _.extend({}, target.state.roomsById);
      rooms[newTestRoom._id] = newTestRoom;
    });

    it('by updating its states messages', function () {
      //ChatRoomStore.emitChange();
      //expect(target.state.roomsById).toBe(rooms);
    });

  });

  describe('responds to SettingsStore updates', function() {
    beforeEach(function() {
      user = {
        _id: '1',
        userName: 'New User Name'
      };
    });

    it('by updating its user state', function () {
      SettingsStore.emitChange();
      expect(target.state.user).toBe(user);
    });
  });

  describe('responds to UserStore updates', function() {
    beforeEach(function() {
      var newUsers = TestData.getNTestUsers(3);
      users = users.concat(newUsers);
    });

    it('by updating its states users', function () {
      UserStore.emitChange();
      expect(target.state.usersById).toEqual(_.indexBy(users, '_id'));
    });
  });

  //describe('responds to room change events', function() {
  //  var room;
  //  beforeEach(function() {
  //    room = 'Room 2';
  //    target._changeRoom(room);
  //    spyOn(ChatRoomActions, 'submitRoom');
  //  });
  //
  //  it('changes it\'s room state', function() {
  //    expect(target.state.room).toBe(room);
  //  });
  //
  //});

  describe('responds to room create events', function() {
    var roomName;
    beforeEach(function() {
      spyOn(ChatRoomActions, 'submitRoom');
      roomName = 'New Room';
      target._createNewChatRoom(roomName);
    });

    it('dispatches a create room event', function() {
      expect(ChatRoomActions.submitRoom.calls.any()).toBeTruthy();
      expect(ChatRoomActions.submitRoom.calls.argsFor(0)[0]).toBe(roomName);
    });
  });
});