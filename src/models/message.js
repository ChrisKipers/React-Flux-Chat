'use strict';
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MessageSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  roomId: {
    type: Schema.ObjectId,
    ref: 'ChatRoom'
  },
  content: {
    type: String,
    default: '',
    required: 'Please fill message content',
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

MessageSchema.pre('save', function (next) {
  this._isNew = this.isNew;
  next();
});

MessageSchema.post('save', function (doc) {
  if (doc._isNew) {
    var ChatRoom = mongoose.model('ChatRoom');
    ChatRoom.updateQ({_id: doc.roomId}, {$push : {messages: doc._id}});
  }
});

mongoose.model('Message', MessageSchema);
