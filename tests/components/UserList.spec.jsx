var React = require('react/addons');
var ReactTestUtils = React.addons.TestUtils;
var UserList = require('../../public/src/js/components/UserList.jsx');
var $ = require('jquery');

describe('The UserList component', function () {
  var target, targetEl, users;

  describe('displays', function () {
    it('empty list when there are no users', function () {
      users = [];
      target = ReactTestUtils.renderIntoDocument(<UserList users={users} />);
      targetEl = target.getDOMNode();
      expect($(targetEl).find('li').length).toBe(users.length);
    });

    it('users when users are not empty', function () {
      users = ['Chris', 'Danny'];
      target = ReactTestUtils.renderIntoDocument(<UserList users={users} />);
      targetEl = target.getDOMNode();
      var userElements = $(targetEl).find('li');

      expect(userElements.length).toBe(users.length);

      for (var i = 0; i < userElements.length && i < users.length; i++) {
        expect(userElements[i].textContent).toBe(users[i]);
      }
    });
  });
});