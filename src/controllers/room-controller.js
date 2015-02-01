var mongoose = require('mongoose-q')(require('mongoose'));
var ChatRoom = mongoose.model('ChatRoom');
var Message = mongoose.model('Message');
var User = mongoose.model('User');
var _ = require('lodash');
var ACTIONS = require('../../public/src/js/constants').ACTIONS;

module.exports.respond = function (io, socket) {
  socket.on(ACTIONS.SUBMIT_ROOM, function (roomName, cb) {
    var newRoom = new ChatRoom({name: roomName, creatorId: socket.userId});
    newRoom.saveQ()
      .then(function (savedRoom) {
        return User.findOneAndUpdateQ({_id: socket.userId}, {$addToSet: {rooms: savedRoom._id}})
          .then(function (updatedUser) {
            cb(savedRoom);
            socket.broadcast.emit(ACTIONS.ADD_ROOM, savedRoom);
            io.emit(ACTIONS.UPDATE_USER, updatedUser);
          });
      });
  });

  socket.on(ACTIONS.SUBMIT_PRIVATE_ROOM, function (recipientId, cb) {
    var query = {
      $or: [
        {creatorId: socket.userId, recipientId: recipientId},
        {creatorId: recipientId, recipientId: socket.userId}
      ]
    };
    ChatRoom.findOneQ(query)
      .then(function (chatRoom) {
        Message.findQ({roomId: chatRoom._id})
        .then(function(messages) {
            updateUserAndEmitEvents(messages, chatRoom);
          })
      })
      .fail(function () {
        var newChatRoom = new ChatRoom({creatorId: socket.userId, recipientId: recipientId, isPrivate: true});
        newChatRoom.saveQ()
          .then(updateUserAndEmitEvents.bind(null, []))
      });

    function updateUserAndEmitEvents(messages, room) {
      User.findOneAndUpdateQ({_id: socket.userId}, {$addToSet: {rooms: room._id}})
        .then(function (updatedUser) {
          cb({
            room: room,
            messages: messages
          });
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
