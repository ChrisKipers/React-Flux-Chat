var _ = require('lodash');

function getUsers(numberOfTestUsersOrUndefined) {
  var numberOfTestUsers = numberOfTestUsersOrUndefined || 3;
  return _.range(0, numberOfTestUsers).map(function (index) {
    return {
      _id: index.toString(),
      userName: 'Test User ' + index
    }
  });
};

function getMessagesForUsersByRoom(roomsOrUndefined, numberOfMessagesForUsersOrUndefined, usersOrUndefined) {
  var rooms = roomsOrUndefined || ['general'];
  var users = usersOrUndefined || getUsers();
  var numberOfMessagesForUsers = numberOfMessagesForUsersOrUndefined || 3;

  function getMessages(room) {
    var numberOfMessageForUserRange = _.range(0, numberOfMessagesForUsers);
    return _.flatten(users.map(function(user) {
      return numberOfMessageForUserRange.map(function (messageIndex) {
        return {
          content: 'This is message ' + messageIndex + ' for user ' + user.userName,
          date: Date.now(),
          userId: user._id,
          room: room
        };
      })
    }));
  }

  return _.reduce(rooms, function(messagesByRoom, room) {
    return messagesByRoom[room] = getMessages(room);
  }, {});

}

module.exports = {
  getUsers: getUsers,
  getMessagesForUsersByRoom: getMessagesForUsersByRoom
};

