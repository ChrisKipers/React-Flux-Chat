var utils = require('../../utils');
var _ = require('lodash');

var chatRooms = {
  General: []
};

function addRoom(room) {
  var newRoom = chatRooms[room] || [];
  chatRooms[room] = newRoom;
  return utils.getPromiseFromValue(newRoom)
}

function addMessage(message) {
  var messageWithId = _.extend({}, message, {
    _id: utils.getNewId()
  });
  chatRooms[message.room].push(messageWithId);
  return utils.getPromiseFromValue(messageWithId);
}

function getChatRooms() {
  return utils.getPromiseFromValue(chatRooms);
}

module.exports = {
  addRoom: addRoom,
  addMessage: addMessage,
  getChatRooms: getChatRooms
};