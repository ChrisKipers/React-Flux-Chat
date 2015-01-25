var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;
var _ = require('lodash');

var MessageList = require('../../public/src/js/components/MessageList.jsx');
var Message = require('../../public/src/js/components/Message.jsx');

var TestData = require('../test-data');


describe('The MessageList component', function () {
  var target, targetEl, messageEls, user, messages;

  describe('with no messages', function () {

    beforeEach(function() {
      user = TestData.getTestUser();
      messages = [];
      target = ReactTestUtils.renderIntoDocument(<MessageList messages={messages} user={user}/>);
      targetEl = target.getDOMNode();
    });

    it('displays no messages', function () {
      expect(ReactTestUtils.scryRenderedComponentsWithType(target, Message).length).toBe(0);
    });
  });

  describe('with messages', function () {
    var messageComponents;
    beforeEach(function() {
      users = TestData.getNTestUsers(2);
      messages = [
        {
          userId: users[0]._id,
          user: users[0],
          content: 'Content 1',
          date: Date.now()
        },
        {
          userId: users[1]._id,
          user: users[1],
          content: 'Content 2',
          date: Date.now()
        }
      ];
      target = ReactTestUtils.renderIntoDocument(<MessageList messages={messages} user={users[0]}/>);
      targetEl = target.getDOMNode();
      messageComponents = ReactTestUtils.scryRenderedComponentsWithType(target, Message);
    });

    it('displays messages', function () {
      expect(messageComponents.length).toBe(2);
    });

    it('passes the correct data to editable messages', function () {
      var expectedProps = _.extend({}, messages[0], {
        editable: true
      });
      expect(messageComponents[0].props).toEqual(expectedProps);
    });

    it('passes the correct data to non-editable messages', function () {
      var expectedProps = _.extend({}, messages[1], {
        editable: false
      });
      expect(messageComponents[1].props).toEqual(expectedProps);
    });
  });

  //@todo Missing test for scrolling

});