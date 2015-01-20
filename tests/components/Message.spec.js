var React = require('react/addons');
var Message = require('../../public/src/js/components/Message.jsx');
var moment = require('moment');
var $ = require('jquery');

describe('The Message component', function () {
  var author = 'Chris Kipers';
  var date = Date.now();
  var content = 'This is the content of the message';
  var message = React.addons.TestUtils.renderIntoDocument(<Message author={author} content={content} date={date} />);
  var messageElement = message.getDOMNode();

  it('renders the author\'s name', function () {
    expect($(messageElement).find('.author').text()).toBe(author);
  });

  it('renders the content', function () {
    expect($(messageElement).find('.content > span').text()).toContain(content);
  });

  it('renders the formatted date', function () {
    var formattedDate = moment(date).format('lll');
    expect($(messageElement).find('.date-time').text()).toBe(formattedDate);
  });
});