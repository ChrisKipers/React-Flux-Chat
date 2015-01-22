var utils = require('../../utils');

var chatRooms = {
  General: []
};

function addRoom(room) {
  var newRoom = chatRooms[room] || [];
  chatRooms[room] = newRoom;
  return utils.getPromiseFromValue(newRoom)
}

function addMessage(message) {
  chatRooms[message.room].push(message);
  return utils.getPromiseFromValue(message);
}

function getChatRooms() {
  return utils.getPromiseFromValue(chatRooms);
}

module.exports = {
  addRoom: addRoom,
  addMessage: addMessage,
  getChatRooms: getChatRooms
};