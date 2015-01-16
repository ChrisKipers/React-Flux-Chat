var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Constants = require('./public/src/js/constants');
var config = require('./config');

var chatRooms = {
  General: []
};

function addRoom(room) {
  chatRooms[room] = chatRooms[room] || [];
}

function addMessage(message) {
  addRoom(message.room);
  chatRooms[message.room].push(message);
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(process.cwd() + '/public'));

io.on('connection', function(socket){

  socket.emit(Constants.SET_MESSAGES, chatRooms);

  socket.on(Constants.SUBMIT_MESSAGE, function(message) {
    addMessage(message);
    io.emit(Constants.ADD_MESSAGE, message);
  });

  socket.on(Constants.SUBMIT_ROOM, function(room) {
    addRoom(room);
    io.emit(Constants.ADD_ROOM, room);
  });

});

http.listen(config.port, function(){
  console.log('listening on *:' + config.port);
});