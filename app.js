/* global __dirname */
/* global process  */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Constants = require('./public/src/js/constants');
var config = require('./config/config');
var generateName = require('sillyname');
var _ = require('lodash');

var chatRooms = {
  General: []
};

var usersBySocketId = {};

function addRoom(room) {
  chatRooms[room] = chatRooms[room] || [];
}

function addMessage(message) {
  addRoom(message.room);
  chatRooms[message.room].push(message);
}

function setUserName(userName, socketId) {
  usersBySocketId[socketId] = userName;
  emitUsers();
}

function removeUser(socketId) {
  delete usersBySocketId[socketId];
  emitUsers();
}

function emitUsers() {
  io.emit(Constants.SET_USERS, _.values(usersBySocketId));
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(process.cwd() + '/public'));

io.on('connection', function(socket){
  var userName = generateName();

  socket.emit(Constants.SET_MESSAGES, chatRooms);
  socket.emit(Constants.SET_USER_NAME_FROM_SERVER, userName);

  setUserName(userName, socket.id);

  socket.on(Constants.SUBMIT_MESSAGE, function(message) {
    addMessage(message);
    io.emit(Constants.ADD_MESSAGE, message);
  });

  socket.on(Constants.SUBMIT_ROOM, function(room) {
    addRoom(room);
    io.emit(Constants.ADD_ROOM, room);
  });

  socket.on(Constants.SET_USER_NAME_FROM_UI, function(userName) {
    setUserName(userName, socket.id);
  });

  socket.on('disconnect', function () {
    removeUser(socket.id);
  });

});

http.listen(config.port, function(){
  console.log('listening on *:' + config.port);
});