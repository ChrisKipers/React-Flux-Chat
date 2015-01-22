var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;
var ChatRoom = require('../../public/src/js/components/ChatRoom.jsx');
var $ = require('jquery');
var MessageActions = require('../../public/src/js/actions/MessageActions');
var _ = require('lodash');
var TestData = require('../test-data');

describe('The ChatRoom component', function () {
  var target, targetEl, messages, room, user;
  beforeEach(function () {
    messages = [
      {author: 'Author 1', content: 'Content 1', date: Date.now()},
      {author: 'Author 2', content: 'Content 2', date: Date.now()}
    ];
    room = 'General';
    user = {
      userName: 'Chris',
      _id: '1'
    };
    target = ReactTestUtils.renderIntoDocument(<ChatRoom room={room} messages={messages} user={user}/>);
    targetEl = target.getDOMNode();
  });

  describe('displays', function () {
    it('the room name', function () {
      expect($(targetEl).find('.chat-room-name').text()).toBe(room);
    });

    it('messages', function () {
      expect($(targetEl).find('.message').length).toBe(messages.length);
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
        room: room,
        content: content,
        userId: user._id
      });

      var isSubmittedDateBetweenSubmitStartAndSubmitEnd =
        submittedMessage.date >= submitStart && submittedMessage.date <= submitEnd;

      expect(isSubmittedDateBetweenSubmitStartAndSubmitEnd).toBe(true);
    });
  });
});