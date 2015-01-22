var generateName = require('sillyname');
var _ = require('lodash');
var utils = require('../../utils');

var userById = {};


function removeUser(id) {
  var user = userById[id]
  delete userById[id];
  return utils.getPromiseFromValue(user);
}

function setUser(user) {
  userById[user._id] = user;
  return utils.getPromiseFromValue(user);
}

function createNewUser () {
  var newUser = {
    userName: generateName(),
    _id: utils.getNewId()
  };
  userById[newUser._id] = newUser;
  return utils.getPromiseFromValue(newUser);
}

function getAllUsers() {
  return utils.getPromiseFromValue(_.values(userById));
}

function getUser(id) {
  return utils.getPromiseFromValue(userById[id]);
}

module.exports = {
  removeUser: removeUser,
  setUser: setUser,
  createNewUser: createNewUser,
  getAllUsers: getAllUsers,
  getUser: getUser
};