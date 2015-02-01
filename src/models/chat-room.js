'use strict';
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ChatRoomSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  creatorId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  recipientId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  isPrivate: {
    type: Boolean,
    default: false
  }
});

mongoose.model('ChatRoom', ChatRoomSchema);
