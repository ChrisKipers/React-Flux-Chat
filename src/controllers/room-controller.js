var mongoose = require('mongoose-q')(require('mongoose'));
var ChatRoom = mongoose.model('ChatRoom');
var _ = require('lodash');
var ACTIONS = require('../../public/src/js/constants').ACTIONS;

module.exports.respond = function (io, socket) {
  socket.on(ACTIONS.SUBMIT_ROOM, function (roomName) {
    var newRoom = new ChatRoom({name: roomName, creatorId: socket.userId});
    newRoom.saveQ()
      .then(function (savedRoom) {
        socket.emit(ACTIONS.ADD_ROOM_SUCCESS, newRoom);
        socket.broadcast.emit(ACTIONS.ADD_ROOM, newRoom);
      });
  });

  socket.on(ACTIONS.SUBMIT_ROOM_UPDATE, function (roomUpdates) {
    ChatRoom.updateQ({_id: roomUpdates._id}, {$set: _.omit(roomUpdates, '_id', 'messages')})
      .then(function () {
        return ChatRoom.findByIdQ(roomUpdates._id, '-messages');
      })
      .then(function (updatedRoom) {
        io.emit(ACTIONS.UPDATE_ROOM, updatedRoom);
      });
  });
};
