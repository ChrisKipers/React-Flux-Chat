var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;
var $ = require('jquery');

var App = require('../../public/src/js/components/App.jsx');

// Composite components that we will be checking for inclusion of
var AppHeader = require('../../public/src/js/components/AppHeader.jsx');
var ChatRoomList = require('../../public/src/js/components/ChatRoomList.jsx');
var CreateRoomInput = require('../../public/src/js/components/CreateRoomInput.jsx');
var UserList = require('../../public/src/js/components/UserList.jsx');
var ChatRoom = require('../../public/src/js/components/ChatRoom.jsx');

var SettingsStore = require('../../public/src/js/stores/SettingsStore');
var MessageStore = require('../../public/src/js/stores/MessageStore');
var UserStore = require('../../public/src/js/stores/UserStore');

var MessageActions = require('../../public/src/js/actions/MessageActions');

describe('The App component', function () {
  var target, targetEl, userName, users, messages;

  beforeEach(function () {
    userName = 'Test User';
    users = ['Test User', 'User 2'];
    messages = {
      General: [{
        author: 'Test User',
        content: 'This is a message',
        date: Date.now(),
        room: 'General'
      }]
    };

    spyOn(SettingsStore, 'getUserName').and.callFake(function() {
      return userName;
    });
    spyOn(MessageStore, 'getAll').and.callFake(function() {
      return messages;
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
      var rooms = Object.keys(target.state.messages);
      expect(chatRoomListComponent.props.rooms).toEqual(rooms);
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
      expect(userListComponent.props.users).toEqual(target.state.users);
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
      expect(chatRoomComponent.props.room).toEqual(target.state.room);
    });

    it('is passed the correct userName property', function () {
      expect(chatRoomComponent.props.userName).toEqual(target.state.userName);
    });

    it('is passed the correct messages property', function () {
      expect(chatRoomComponent.props.messages).toEqual(target.state.messages[target.state.room]);
    });
  });

  describe('responds to MessageStore updates', function() {
    beforeEach(function() {
      messages = {
        General: [
          {
            author: 'Chris',
            content: 'new Message',
            room: 'General',
            date: Date.now()
          }
        ]
      };
    });

    it('by updating its states messages', function () {
      MessageStore.emitChange();
      expect(target.state.messages).toBe(messages);
    });

  });

  describe('responds to SettingsStore updates', function() {
    beforeEach(function() {
      userName = 'New User Name';
    });

    it('by updating its states messages', function () {
      SettingsStore.emitChange();
      expect(target.state.userName).toBe(userName);
    });
  });

  describe('responds to UserStore updates', function() {
    beforeEach(function() {
      users = ['New User Name'];
    });

    it('by updating its states messages', function () {
      UserStore.emitChange();
      expect(target.state.users).toBe(users);
    });
  });

  describe('responds to room change events', function() {
    var room;
    beforeEach(function() {
      room = 'Room 2';
      target._changeRoom(room);
      spyOn(MessageActions, 'submitRoom');
    });

    it('changes it\'s room state', function() {
      expect(target.state.room).toBe(room);
    });

  });

  describe('responds to room create events', function() {
    var room;
    beforeEach(function() {
      spyOn(MessageActions, 'submitRoom');
      room = 'New Room';
      target._createNewChatRoom(room);
    });

    it('changes it\'s room state', function() {
      expect(target.state.room).toBe(room);
    });

    it('dispatches a create room event', function() {
      expect(MessageActions.submitRoom.calls.any()).toBeTruthy();
      expect(MessageActions.submitRoom.calls.argsFor(0)[0]).toBe(room);
    });
  });
});