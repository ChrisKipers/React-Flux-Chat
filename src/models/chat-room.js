'use strict';
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ChatRoomSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Chat Room name',
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
  messages: [{
    type: Schema.ObjectId,
    ref: 'Message'
  }]
});

mongoose.model('ChatRoom', ChatRoomSchema);
