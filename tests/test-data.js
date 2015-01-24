var _ = require('lodash');
var Guid = require('guid');

function getTestUser() {
  var _id = Guid.raw();
  return {
    _id: _id,
    userName: _id
  };
}

function getNTestUsers(numberOfTestUsers) {
  return _.range(0, numberOfTestUsers).map(getTestUser);
};

function getTestRoom(userId) {
  var _id = Guid.raw();
  return {
    _id: _id,
    creatorId: userId,
    createdDate: Date.now(),
    name: _id + 'Name',
    messages: [
      {
        userId: userId,
        content: 'Test Message',
        date: Date.now(),
        _id: Guid.raw()
      }
    ]
  }
}


module.exports = {
  getTestUser: getTestUser,
  getNTestUsers: getNTestUsers,
  getTestRoom: getTestRoom
};

