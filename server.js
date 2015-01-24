'use strict';
/* global process  */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ACTIONS = require('./public/src/js/constants').ACTIONS;
var config = require('./config/config');
var _ = require('lodash');
var Q = require('q');

var RoomPersistence = require('./src/persistence/RoomPersistence');
var UserPersistence = require('./src/persistence/UserPersistence');

var session = require('express-session');
var cookieParser = require('cookie-parser');
var sessionMiddleware = session({secret: config.sessionSecret});
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(sessionMiddleware);


app.get('/', function (req, res) {
  if (req.session.userId === undefined) {
    UserPersistence.createNewUser()
      .then(function (newUser) {
        req.session.userId = newUser._id;
        render();
      });
  } else {
    render();
  }

  function render() {
    res.render('index', {
      jsFiles: config.jsFiles,
      cssFiles: config.cssFiles
    });
  }
});

app.use(express.static(process.cwd() + '/public'));

io.use(function (socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

io.use(function (socket, next) {
  socket.userId = socket.request.session.userId;
  next();
});

io.on('connection', function (socket) {

  Q.all([RoomPersistence.getChatRooms(), UserPersistence.getUser(socket.userId), UserPersistence.getAllUsers()])
    .then(function (results) {
      var initializationData = {
        user: results[1],
        roomsById: results[0],
        users: results[2]
      };
      socket.emit(ACTIONS.INITIALIZE_STORES, initializationData);
    });

  emitUsers();

  socket.on(ACTIONS.SUBMIT_MESSAGE, function (message) {
    RoomPersistence.addMessage(message)
      .then(function (newMessage) {
        io.emit(ACTIONS.ADD_MESSAGE, newMessage);
      });
  });

  socket.on(ACTIONS.SUBMIT_ROOM, function (roomName) {
    RoomPersistence.createGeneralRoom(socket.userId, roomName)
      .then(function (newRoom) {
        socket.emit(ACTIONS.ADD_ROOM_SUCCESS, newRoom);
        socket.broadcast.emit(ACTIONS.ADD_ROOM, newRoom);
      });

  });

  socket.on(ACTIONS.SUBMIT_MESSAGE_UPDATE, function(message) {
    RoomPersistence.updateMessage(message)
      .then(function(updatedMessage) {
        io.emit(ACTIONS.UPDATE_MESSAGE, updatedMessage);
      });
  });

  socket.on(ACTIONS.SUBMIT_ROOM_UPDATE, function(room) {
    RoomPersistence.updateRoom(room)
      .then(function(updatedRoom) {
        io.emit(ACTIONS.UPDATE_ROOM, updatedRoom);
      });
  });

  socket.on(ACTIONS.SET_USER_NAME_FROM_UI, function (userName) {
    UserPersistence.getUser(socket.userId)
      .then(function(user) {
        var updatedUser = _.extend(user, {
          userName: userName
        });
        return UserPersistence.setUser(updatedUser);
      })
      .then(emitUsers);
  });




  socket.on('disconnect', function () {
    //removeUser(socket.id);
  });
});

function emitUsers() {
  UserPersistence.getAllUsers()
    .then(function (allUsers) {
      io.emit(ACTIONS.SET_USERS, allUsers);
    });

}

http.listen(config.port, function () {
  console.log('listening on *:' + config.port);
});