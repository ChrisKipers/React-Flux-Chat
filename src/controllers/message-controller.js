var mongoose = require('mongoose-q')(require('mongoose'));
var Message = mongoose.model('Message');
var ChatRoom =mongoose.model('ChatRoom');
var User = mongoose.model('User');
var Q = require('q');

var _ = require('lodash');
var ACTIONS = require('../../public/src/js/constants').ACTIONS;

module.exports.respond = function (io, socket) {
  function submitNormalMessage(message) {
    var newMessage = new Message(message);
    newMessage.saveQ()
      .then(function (savedMessage) {
        io.emit(ACTIONS.ADD_MESSAGE, savedMessage);
      });
  }

  //@todo OMG callback hell, clean this up!!! Also not the greats logic, many assumptions
  function submitPrivateMessage(message, room) {
    var newMessage = new Message(message);
    var messageInsertPromise = newMessage.saveQ();

    var targetUsersId = room.creatorId.toString() === socket.userId ?
      room.recipientId : room.creatorId;
    User.findOneQ({_id: targetUsersId})
      .then(function(targetUser) {
        //If room is not visible, we need to make it visible so that the user
        //Knows we are chatting with him
        if (!_.find(targetUser.rooms, room._id)) {
          User.findOneAndUpdateQ({_id: targetUsersId}, {$addToSet: {rooms: room._id}})
            .then(function(updatedUser) {
              //todo this needs to account for users on multiple socketrs
              var allClients = io.sockets.sockets;
              var targetClient = _.find(allClients, {userId: targetUsersId.toString()});
              if (targetClient) {
                targetClient.emit(ACTIONS.ADD_PRIVATE_ROOM, room, function () {
                  io.emit(ACTIONS.UPDATE_USER, updatedUser);
                  messageInsertPromise.then(function(savedMessage) {
                    socket.emit(ACTIONS.ADD_MESSAGE, savedMessage);
                    targetClient.emit(ACTIONS.ADD_MESSAGE, savedMessage);
                  });
                })
              }
            });
        } else {
          messageInsertPromise.then(function(savedMessage) {
            socket.emit(ACTIONS.ADD_MESSAGE, savedMessage);
          });
        }
      })
  }

  socket.on(ACTIONS.SUBMIT_MESSAGE, function (message) {
    ChatRoom.findOneQ({_id: message.roomId})
      .then(function(room) {
        if (room.isPrivate) {
          submitPrivateMessage(message, room);
        } else {
          submitNormalMessage(message);
        }
      });
  });

  socket.on(ACTIONS.SUBMIT_MESSAGE_UPDATE, function (messageUpdates) {
    Message.findByIdQ(messageUpdates._id)
      .then(function (message) {
        message = _.extend(message, messageUpdates);
        return message.saveQ();
      })
      .then(function (message) {
        io.emit(ACTIONS.UPDATE_MESSAGE, message);
      });
  });
};
