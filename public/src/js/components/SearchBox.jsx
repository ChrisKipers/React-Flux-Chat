'use strict';
/*jshint quotmark:false */
var React = require('react/addons');
var _ = require('lodash');

var ChatRoomSearchResult = require('./ChatRoomSearchResult.jsx');
var UserSearchResult = require('./UserSearchResults.jsx');
var NoSearchResults = require('./NoSearchResults.jsx');

var ChatRoomStore = require('../stores/ChatRoomStore');
var UserStore = require('../stores/UserStore');

var SearchBox = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function () {
    return {active: false, searchText: '', users: UserStore.getUsers(), rooms: ChatRoomStore.getAll()};
  },
  componentDidMount: function () {
    UserStore.addChangeListener(this._onUsersChange);
    ChatRoomStore.addChangeListener(this._onRoomsChange);
  },

  componentWillUnmount: function () {
    UserStore.removeChangeListener(this._onUsersChange);
    ChatRoomStore.removeChangeListener(this._onRoomsChange);
  },
  render: function () {
    var searchResultsComponent = this.state.active ? this._calculateResults() : null;

    return (
      <div className="search-box">
        <div className="search-box-wrapper">
          <input type="text" valueLink={this.linkState('searchText')}
            onFocus={this._focus} onBlur={this._blur} placeholder="Search"/>
          {searchResultsComponent}
        </div>
      </div>
    );
  },
  _calculateResults: function () {
    var lowerCaseSearch = this.state.searchText.toLowerCase();

    var matchingRooms = _.values(this.state.rooms).filter(function (room) {
      var lowerCaseRoomName = room.name.toLowerCase();
      return lowerCaseRoomName.indexOf(lowerCaseSearch) !== -1;
    });

    var matchingUsers = this.state.users.filter(function (user) {
      var lowerCaseUserName = user.userName.toLowerCase();
      return lowerCaseUserName.indexOf(lowerCaseSearch) !== -1;
    });

    var roomResultsComponents = matchingRooms.map(function (room) {
      return <ChatRoomSearchResult {...room} key={room._id} onRoomJoin={this._clearSearchCriteria} />;
    }.bind(this));

    var userResultsComponents = matchingUsers.map(function (user) {
      return <UserSearchResult {...user} key={user._id}  onRoomJoin={this._clearSearchCriteria} />;
    }.bind(this));

    var noResultsComponent = roomResultsComponents.length + userResultsComponents.length === 0 ?
      <NoSearchResults /> : null;

    return (
      <div className="search-results">
        <ul>
          {roomResultsComponents}
        </ul>
        <ul>
          {userResultsComponents}
        </ul>
        {noResultsComponent}
      </div>
    );
  },
  _clearSearchCriteria: function () {
    this.setState({searchText: ''});
  },
  _onUsersChange: function () {
    this.setState({users: UserStore.getUsers()});
  },
  _onRoomsChange: function() {
    this.setState({rooms: ChatRoomStore.getAll()});
  },
  _focus: function() {
    this.setState({active: true});
  },
  _blur: function() {
    this.setState({active: false});
  }
});

module.exports = SearchBox;