var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;

var MessageList = require('../../public/src/js/components/MessageList.jsx');
var $ = require('jquery');

describe('The MessageList component', function () {
  var target, targetEl, messageEls;

  describe('with no messages', function () {
    beforeEach(function() {
      setTargetWithMessages([]);
    });

    it('displays no messages', function () {
      expect(messageEls.length).toBe(0);
    });
  });

  describe('with messages', function () {
    var messages;
    beforeEach(function() {
      messages = [
        {
          author: 'Author 1',
          content: 'Content 1',
          date: Date.now()
        },
        {
          author: 'Author 2',
          content: 'Content 2',
          date: Date.now()
        }
      ];
      setTargetWithMessages(messages);
    });

    it('displays messages', function () {
      expect(messageEls.length).toBe(2);
    });
  });

  //@todo Missing test for scrolling

  function setTargetWithMessages(messages) {
    target = ReactTestUtils.renderIntoDocument(<MessageList messages={messages} />);
    targetEl = target.getDOMNode();
    messageEls = $(targetEl).find('.message');
  }
});