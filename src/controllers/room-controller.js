var mongoose = require('mongoose-q')(require('mongoose'));
var ChatRoom = mongoose.model('ChatRoom');
var User = mongoose.model('User');
var _ = require('lodash');
var ACTIONS = require('../../public/src/js/constants').ACTIONS;

module.exports.respond = function (io, socket) {
  socket.on(ACTIONS.SUBMIT_ROOM, function (roomName) {
    var newRoom = new ChatRoom({name: roomName, creatorId: socket.userId});
    newRoom.saveQ()
      .then(function (savedRoom) {
        return User.findOneAndUpdateQ({_id: socket.userId}, {$addToSet: {rooms: savedRoom._id}})
          .then(function (updatedUser) {
            socket.emit(ACTIONS.ADD_ROOM_SUCCESS, savedRoom);
            socket.broadcast.emit(ACTIONS.ADD_ROOM, savedRoom);
            io.emit(ACTIONS.UPDATE_USER, updatedUser);
          });
      });
  });

  socket.on(ACTIONS.SUBMIT_PRIVATE_ROOM, function (recipientId) {

    var query = {
      $or: [
        {creatorId: socket.userId, recipientId: recipientId},
        {creatorId: recipientId, recipientId: socket.userId}
      ]
    };
    ChatRoom.findOneQ(query)
      .then(updateUserAndEmitEvents)
      .fail(function () {
        var newChatRoom = new ChatRoom({creatorId: socket.userId, recipientId: recipientId, isPrivate: true});
        newChatRoom.saveQ()
          .then(updateUserAndEmitEvents)
      });

    function updateUserAndEmitEvents(chatRoom) {
      User.findOneAndUpdateQ({_id: socket.userId}, {$addToSet: {rooms: chatRoom._id}})
        .then(function (updatedUser) {
          socket.emit(ACTIONS.ADD_ROOM_SUCCESS, chatRoom);
          io.emit(ACTIONS.UPDATE_USER, updatedUser);
        });
    }
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
