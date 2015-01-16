var React = require('react');
var UserStore = require('../stores/UserStore');

var UserList = React.createClass({
  getInitialState: function() {
    return {users: UserStore.getUsers()};
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var roomComponents = this.state.users.map(function(user) {
      return (
        <li>{user}</li>
      )
    });
    return (
      <ul className="user-list">
        {roomComponents}
      </ul>
    );
  },

  _onChange: function() {
    this.setState({users: UserStore.getUsers()});
  }
});

module.exports = UserList;