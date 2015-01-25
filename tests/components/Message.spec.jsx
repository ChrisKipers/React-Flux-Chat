var React = require('react/addons');
var Message = require('../../public/src/js/components/Message.jsx');
var moment = require('moment');
var $ = require('jquery');

describe('The Message component', function () {
  var user = {
    userName: 'Chris Kipers',
    _id: '1'
  };
  var date = Date.now();
  var content = 'This is the content of the message';
  var message = React.addons.TestUtils.renderIntoDocument(<Message user={user} content={content} date={date} />);
  var messageElement = message.getDOMNode();

  it('renders the author\'s name', function () {
    expect($(messageElement).find('.author').text()).toBe(user.userName);
  });

  it('renders the content', function () {
    expect($(messageElement).find('.content').text()).toContain(content);
  });

  it('renders the formatted date', function () {
    var formattedDate = moment(date).format('lll');
    expect($(messageElement).find('.date-time').text()).toBe(formattedDate);
  });
});