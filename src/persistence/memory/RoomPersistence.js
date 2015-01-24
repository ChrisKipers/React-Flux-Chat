var utils = require('../../utils');
var _ = require('lodash');
var ROOM_TYPES = require('../../../public/src/js/constants').ROOM_TYPES;

var chatRoomsById = {};

function createExtendableRoom(creatorId) {
  return {
    _id: utils.getNewId(),
    creatorId: creatorId,
    createdDate: Date.now(),
    messages: []
  };
}

function addRoom(newRoom) {
  chatRoomsById[newRoom._id] = newRoom;
  return utils.getPromiseFromValue(newRoom);
}

function addGeneralRoom(creatorId, roomName) {
  var newRoom = _.extend(createExtendableRoom(creatorId), {
    name: roomName,
    users: [creatorId],
    type: ROOM_TYPES.GENERAL
  });
  return addRoom(newRoom);
}

function addPrivateRoom(creatorId, targetUserId) {
  var newRoom = _.extend(createExtendableRoom(creatorId), {
    users: [creatorId, targetUserId],
    type: ROOM_TYPES.PRIVATE
  });
  return addRoom(newRoom);
}

function addMessage(message) {
  var messageWithId = _.extend({}, message, {
    _id: utils.getNewId()
  });
  chatRoomsById[message.roomId].messages.push(messageWithId);
  return utils.getPromiseFromValue(messageWithId);
}

function updateMessage(updatedMessage) {
  var room = chatRoomsById[updatedMessage.roomId];
  var messageIndex = _.findIndex(room.messages, function (message) {
    return message._id === updatedMessage._id;
  });
  var oldMessage = room.messages[messageIndex];
  var messageMergedWithUpdates = _.extend({}, oldMessage, updatedMessage);
  room.messages[messageIndex] = messageMergedWithUpdates;
  return utils.getPromiseFromValue(messageMergedWithUpdates);
}

function updateRoom(room) {
  var currentRoomInfo = chatRoomsById[room._id];
  var updatedRoom = _.extend({}, currentRoomInfo, room);
  chatRoomsById[room._id] = updatedRoom;
  return utils.getPromiseFromValue(updatedRoom);
}

function getChatRooms() {
  return utils.getPromiseFromValue(chatRoomsById);
}

module.exports = {
  createGeneralRoom: addGeneralRoom,
  createPrivateRoom: addPrivateRoom,
  addMessage: addMessage,
  getChatRooms: getChatRooms,
  updateMessage: updateMessage,
  updateRoom: updateRoom
};