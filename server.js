'use strict';
/* global process  */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ACTIONS = require('./public/src/js/constants').ACTIONS;
var config = require('./config/config');
var Q = require('q');

// Most load models to ensure they are used correctly
var mongoose = require('mongoose-q')(require('mongoose'));
['chat-room', 'message', 'user'].forEach(function (model) {
  require('./src/models/' + model);
});

mongoose.connect(config.db);

var ChatRoom = mongoose.model('ChatRoom');
var User = mongoose.model('User');
var Message = mongoose.model('Message');

var RoomController = require('./src/controllers/room-controller');
var MessageController = require('./src/controllers/message-controller');
var UserController = require('./src/controllers/user-controller');

var session = require('express-session');
var mongoStore = require('connect-mongo')({
  session: session
});
var cookieParser = require('cookie-parser');
var sessionMiddleware = session({
  secret: config.sessionSecret,
  saveUninitialized: true,
  resave: true,
  store: new mongoStore({
    url: config.db
  })
});

app.set('view engine', 'jade');
app.use(cookieParser());
app.use(sessionMiddleware);


app.get('/', function (req, res) {
  function render() {
    res.render('index', {
      jsFiles: config.jsFiles,
      cssFiles: config.cssFiles
    });
  }

  if (req.session.userId === undefined) {
    var newUser = new User({});
    newUser.saveQ()
      .then(function (savedUser) {
        req.session.userId = savedUser._id;
        render();
      });
  } else {
    render();
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

function emitUsers() {
  User.findQ()
    .then(function (allUsers) {
      io.emit(ACTIONS.SET_USERS, allUsers);
    });

}

function getInitializationDataPromise(userId) {
  return User.findByIdQ(userId)
    .then(function (user) {
      var roomQuery = {
        $or: [
          {isPrivate: false},
          {creatorId: user._id},
          {recipientId: user._id}
        ]
      };
      var messageQuery = {
        roomId: {$in: user.rooms}
      };
      var userPromise = Q.defer();
      userPromise.resolve(user);
      return Q.all([ChatRoom.findQ(roomQuery), Message.findQ(messageQuery), User.findQ(), userPromise.promise]);
    });
}

io.on('connection', function (socket) {
  emitUsers();

  getInitializationDataPromise(socket.userId)
    .then(function (results) {
      var initializationData = {
        rooms: results[0],
        messages: results[1],
        users: results[2],
        user: results[3]
      };
      socket.emit(ACTIONS.INITIALIZE_STORES, initializationData);
    });

  RoomController.respond(io, socket);
  UserController.respond(io, socket);
  MessageController.respond(io, socket);

  socket.on('disconnect', function () {
    //removeUser(socket.id);
  });
});

http.listen(config.port, function () {
  console.log('listening on *:' + config.port);
});
