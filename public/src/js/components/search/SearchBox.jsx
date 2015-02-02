'use strict';
/*jshint quotmark:false */
var React = require('react/addons');
var _ = require('lodash');
var utils = require('../../utils/utils');
var dimensions = require('../../utils/dimensions');

var ChatRoomSearchResult = require('./ChatRoomSearchResult.jsx');
var UserSearchResult = require('./UserSearchResults.jsx');
var NoSearchResults = require('./NoSearchResults.jsx');

var ChatRoomStore = require('../../stores/ChatRoomStore');
var UserStore = require('../../stores/UserStore');
var SettingsStore = require('../../stores/SettingsStore');

var SearchBox = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function () {
    return {
      active: false, searchText: '',
      users: UserStore.getUsers(),
      rooms: ChatRoomStore.getAll(),
      user: SettingsStore.getUser()
    };
  },
  componentDidMount: function () {
    UserStore.addChangeListener(this._onUsersChange);
    ChatRoomStore.addChangeListener(this._onRoomsChange);
    SettingsStore.addChangeListener(this._onUserChange);
  },

  componentWillUnmount: function () {
    UserStore.removeChangeListener(this._onUsersChange);
    ChatRoomStore.removeChangeListener(this._onRoomsChange);
    SettingsStore.removeChangeListener(this._onUserChange);
  },
  render: function () {
    var searchResultsComponent = this.state.active ? this._renderResults() : null;

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
  _renderResults: function () {
    var lowerCaseSearch = this.state.searchText.toLowerCase();

    var matchingRooms = _.values(this.state.rooms)
      .filter(function (room) {
        var lowerCaseRoomName = room.name.toLowerCase();
        return !room.isPrivate && lowerCaseRoomName.indexOf(lowerCaseSearch) !== -1;
      });

    var matchingUsers = this.state.users.filter(function (user) {
      var lowerCaseUserName = user.userName.toLowerCase();
      return user._id !== this.state.user._id && lowerCaseUserName.indexOf(lowerCaseSearch) !== -1;
    }.bind(this));

    var roomResultsComponents = matchingRooms.map(function (room) {
      return <ChatRoomSearchResult {...room} key={room._id} onRoomJoin={this._clearSearchCriteria} />;
    }.bind(this));

    var userResultsComponents = matchingUsers.map(function (user) {
      return <UserSearchResult {...user} key={user._id}  onRoomJoin={this._clearSearchCriteria} />;
    }.bind(this));

    var roomResultsComponent = roomResultsComponents.length > 0 ?
      <ul className="room-results">{roomResultsComponents}</ul> : null;

    var userResultsComponent = userResultsComponents.length > 0 ?
      <ul className="user-results">{userResultsComponents}</ul> : null;

    var noResultsComponent = roomResultsComponents.length + userResultsComponents.length === 0 ?
      <NoSearchResults /> : null;

    return (
      <div className="search-results" ref="searchResults">
        {roomResultsComponent}
        {userResultsComponent}
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
  _onRoomsChange: function () {
    this.setState({rooms: ChatRoomStore.getAll()});
  },
  _onUserChange: function() {
    this.setState({user: SettingsStore.getUser()});
  },
  _focus: function () {
    this.setState({active: true}, function () {
      this._setSearchResultsMaxHeight();
    }.bind(this));
  },
  _blur: function () {
    this.setState({active: false});
  },
  _setSearchResultsMaxHeight: function () {
    var resultsEl = this.refs.searchResults.getDOMNode();
    var resultsOffset = utils.cumulativeOffset(resultsEl);
    var windowHeight = dimensions.getWindowHeight();
    var maxHeight = windowHeight - resultsOffset.top - 10;
    resultsEl.style.maxHeight = maxHeight + 'px';
  }
});

module.exports = SearchBox;