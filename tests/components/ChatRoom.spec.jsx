var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;
var ChatRoom = require('../../public/src/js/components/ChatRoom.jsx');
var $ = require('jquery');
var ChatRoomActions = require('../../public/src/js/actions/ChatRoomActions');
var _ = require('lodash');
var TestData = require('../test-data');

describe('The ChatRoom component', function () {
  var target, targetEl, messages, room, user;
  beforeEach(function () {
    user = {
      userName: 'Chris',
      _id: '1'
    };
    room = {
      _id: '12',
      name: 'Test Room',
      creatorId: user._id,
      creator: user,
      createdDate: Date.now(),
      messages: [{
        userId: user._id,
        user: user,
        content: 'Test User content',
        date: Date.now()
      }]
    };

    target = ReactTestUtils.renderIntoDocument(<ChatRoom room={room} user={user}/>);
    targetEl = target.getDOMNode();
  });

  describe('displays', function () {
    it('the room name', function () {
      expect($(targetEl).find('.chat-room-name').text()).toBe(room.name);
    });

    it('messages', function () {
      expect($(targetEl).find('.message').length).toBe(room.messages.length);
    });
  });

  describe('has a message input', function () {
    var messageInput;
    var inputForm;
    beforeEach(function () {
      messageInput = target.refs.messageInput.getDOMNode();
      inputForm = $(targetEl).find('form')[0];
      spyOn(ChatRoomActions, 'submitMessage');
    });

    it('that does not submit an empty message', function () {
      ReactTestUtils.Simulate.submit(inputForm);
      expect(ChatRoomActions.submitMessage.calls.count()).toBe(0);
    });

    it('submits a message with content', function () {
      var content = 'New message content';
      messageInput.value = content;
      ReactTestUtils.Simulate.submit(inputForm);
      expect(ChatRoomActions.submitMessage.calls.count()).toBe(1);
    });

    it('submits a properly formed comment', function () {
      var content = 'New message content';
      messageInput.value = content;

      var submitStart = Date.now();
      ReactTestUtils.Simulate.submit(inputForm);
      var submitEnd = Date.now();

      var submittedMessage = ChatRoomActions.submitMessage.calls.argsFor(0)[0];

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