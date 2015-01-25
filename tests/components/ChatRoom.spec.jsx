var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;
var $ = require('jquery');
var _ = require('lodash');

var ChatRoom = require('../../public/src/js/components/ChatRoom.jsx');
var ChatRoomHeader = require('../../public/src/js/components/ChatRoomHeader.jsx');
var MessageList = require('../../public/src/js/components/MessageList.jsx');

var SettingsStore = require('../../public/src/js/stores/SettingsStore');
var UserStore = require('../../public/src/js/stores/UserStore');

var MessageActions = require('../../public/src/js/actions/MessageActions');
var _ = require('lodash');
var TestData = require('../test-data');

describe('The ChatRoom component', function () {
  var target, targetEl, room, user, users, mergedRoom;
  beforeEach(function () {
    users = TestData.getNTestUsers(3);
    user = users[0];

    room = {
      _id: '12',
      name: 'Test Room',
      creatorId: user._id,
      createdDate: Date.now(),
      messages: [
        {
          userId: user._id,
          content: 'Test User content',
          date: Date.now()
        },
        {
          userId: users[1]._id,
          content: 'Test User 2 Content',
          date: Date.now()
        },
        {
          userId: users[2]._id,
          content: 'Test User 3 Content',
          date: Date.now()
        }
      ]
    };

    mergedRoom = {
      _id: '12',
      name: 'Test Room',
      creator: user,
      creatorId: user._id,
      createdDate: Date.now(),
      messages: [
        {
          userId: user._id,
          user: user,
          content: 'Test User content',
          date: Date.now()
        },
        {
          userId: users[1]._id,
          user: users[1],
          content: 'Test User 2 Content',
          date: Date.now()
        },
        {
          userId: users[2]._id,
          user: users[2],
          content: 'Test User 3 Content',
          date: Date.now()
        }
      ]
    };

    spyOn(UserStore, 'getUsers').and.returnValue(users);
    spyOn(SettingsStore, 'getUser').and.returnValue(user);

    target = ReactTestUtils.renderIntoDocument(<ChatRoom room={room}/>);
    targetEl = target.getDOMNode();
  });

  describe('has a chat room header', function () {
    var chatRoomHeader;
    beforeEach(function () {
      chatRoomHeader = ReactTestUtils.findRenderedComponentWithType(target, ChatRoomHeader);
    });

    it('that is rendered', function () {
      expect(chatRoomHeader).toBeTruthy();
    });

    it('that is passed the merged room data', function () {
      expect(chatRoomHeader.props.room).toEqual(mergedRoom);
    });
  });

  describe('has a message list', function () {
    var messageList;
    beforeEach(function () {
      messageList = ReactTestUtils.findRenderedComponentWithType(target, MessageList);
    });

    it('that is rendered', function () {
      expect(messageList).toBeTruthy();
    });

    it('that is passed the merged message data', function () {
      expect(messageList.props.messages).toEqual(mergedRoom.messages);
    });

    it('that is passed the correct user', function () {
      expect(messageList.props.user).toEqual(user);
    });
  });

  describe('has a message input', function () {
    var messageInput;
    var inputForm;
    beforeEach(function () {
      messageInput = target.refs.messageInput.getDOMNode();
      inputForm = $(targetEl).find('form')[0];
      spyOn(MessageActions, 'submitMessage');
    });

    it('that does not submit an empty message', function () {
      ReactTestUtils.Simulate.submit(inputForm);
      expect(MessageActions.submitMessage.calls.count()).toBe(0);
    });

    it('submits a message with content', function () {
      var content = 'New message content';
      messageInput.value = content;
      ReactTestUtils.Simulate.submit(inputForm);
      expect(MessageActions.submitMessage.calls.count()).toBe(1);
    });

    it('submits a properly formed comment', function () {
      var content = 'New message content';
      messageInput.value = content;

      var submitStart = Date.now();
      ReactTestUtils.Simulate.submit(inputForm);
      var submitEnd = Date.now();

      var submittedMessage = MessageActions.submitMessage.calls.argsFor(0)[0];

      expect(_.omit(submittedMessage, 'date')).toEqual({
        roomId: room._id,
        content: content,
        userId: user._id
      });

      var isSubmittedDateBetweenSubmitStartAndSubmitEnd =
        submittedMessage.date >= submitStart && submittedMessage.date <= submitEnd;

      expect(isSubmittedDateBetweenSubmitStartAndSubmitEnd).toBe(true);
    });
  });
});