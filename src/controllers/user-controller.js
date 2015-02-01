var mongoose = require('mongoose-q')(require('mongoose'));
var User = mongoose.model('User');
var Message = mongoose.model('Message');

var _ = require('lodash');
var ACTIONS = require('../../public/src/js/constants').ACTIONS;
var Q = require('q');

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

  socket.on(ACTIONS.JOIN_ROOM, function (roomId, cb) {
    Q.all([
      User.findOneAndUpdateQ({_id: socket.userId}, {$addToSet: {rooms: roomId}}),
      Message.findQ({roomId: roomId})
    ])
      .then(function (results) {
        io.emit(ACTIONS.UPDATE_USER, results[0]);
        cb(results[1]);
      });
  });

  socket.on(ACTIONS.LEAVE_ROOM, function (roomId, cb) {
    User.findOneAndUpdateQ({_id: socket.userId}, {$pull: {rooms: roomId}})
      .then(function (updatedUser) {
        io.emit(ACTIONS.UPDATE_USER, updatedUser);
        cb();
      });
  });

};
