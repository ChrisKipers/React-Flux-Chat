'use strict';
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  generateName = require('sillyname');;

var UserSchema = new Schema({
  userName: {
    type: String,
    default: generateName(),
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('User', UserSchema);
