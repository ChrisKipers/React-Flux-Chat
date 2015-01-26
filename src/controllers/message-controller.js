var mongoose = require('mongoose-q')(require('mongoose'));
var Message = mongoose.model('Message');
var _ = require('lodash');
var ACTIONS = require('../../public/src/js/constants').ACTIONS;

module.exports.respond = function (io, socket) {
  socket.on(ACTIONS.SUBMIT_MESSAGE, function (message) {
    var newMessage = new Message(message);
    newMessage.saveQ()
      .then(function (savedMessage) {
        io.emit(ACTIONS.ADD_MESSAGE, savedMessage);
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
