var mongoose = require('mongoose-q')(require('mongoose'));
var User = mongoose.model('User');
var _ = require('lodash');
var ACTIONS = require('../../public/src/js/constants').ACTIONS;

module.exports.respond = function (io, socket) {
  socket.on(ACTIONS.SET_USER_NAME_FROM_UI, function (userName) {
    User.findByIdQ(socket.userId)
      .then(function (user) {
        user.userName = userName;
        return user.saveQ();
      })
      .then(function (updatedUser) {
        io.emit(ACTIONS.UPDATE_USER, updatedUser);
      });
  });

  socket.on(ACTIONS.JOIN_ROOM, function (roomId) {
    User.findOneAndUpdateQ({_id: socket.userId}, {$addToSet: {rooms: roomId}})
      .then(function(updatedUser) {
        io.emit(ACTIONS.UPDATE_USER, updatedUser);
      });
  });

  socket.on(ACTIONS.LEAVE_ROOM, function (roomId) {
    User.findOneAndUpdateQ({_id: socket.userId}, {$pull: {rooms: roomId}})
      .then(function(updatedUser) {
        io.emit(ACTIONS.UPDATE_USER, updatedUser);
      });
  });

};
