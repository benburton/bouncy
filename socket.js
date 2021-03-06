var io = require('socket.io');
var userCount = 0;
var names = ['Martin', 'Mark', 'Randa', 'Cyan', 'Trashy', 'Dre', 'Xzibit', 'DMX', 'Florida', 'Jinx', 'ODB']
var users = [];
var userProto = {
  name: '',
  radius: 100,
  speed: 5,
  color: '',
  x: 150,
  y: 150,
  userId: ''
};
var globalMap = {
  type: 'map',
  users: []
}

exports.initialize = function(server) {
  io = io.listen(server);
  io.sockets.on("connection", function(socket) {
    globalMap.users[userCount] = Object.create(userProto);
    var rnd = Math.floor((Math.random() * 10) + 0);
    globalMap.users[userCount].name = names[rnd];
    globalMap.users[userCount].color = "rgba(" + createRandom(0,255) + ", " + createRandom(0,255) + ", " + createRandom(0,255) + ", 0.5)";
    globalMap.users[userCount].x = 150;
    globalMap.users[userCount].y = 150;
    globalMap.users[userCount].radius = 100;
    globalMap.users[userCount].speed = 5;
    socket.send(JSON.stringify(
      {
        type: 'serverMessage',
        message: 'Welcome to Bouncy ' + globalMap.users[userCount].name + '! ' + userCount,
        userId: userCount,
        color: globalMap.users[userCount].color
      }
    ));
    console.log("globalMap");
    console.log(globalMap);
    socket.send(JSON.stringify(globalMap));
    userCount++;
    socket.on('message', function(message){
      //PARSE THE MESSAGE FROM STRING BACK TO JSON
      try {

        message = JSON.parse(message);

        if (message.type == 'userAction') {
          if (message.message.radius > 200){return;};
          if (message.message.speed > 10){return;};
          console.log(message);
          var map = stateBuilder(message);
          socket.broadcast.send(JSON.stringify(map));
          console.log("sending map");
          console.log(map);
          //message.type = 'myMessage';
          socket.send(JSON.stringify(map));
        }
      } catch (x) {
          if (users[userCount] === 'undefined') {return}
          console.log(x);
        }

    });
  });
};


var stateBuilder = function (message) {
  globalMap.users[message.message.userId] = {
    x: message.message.x,
    y: message.message.y,
    radius: message.message.radius,
    color: message.message.color
  };
  return globalMap;
}

var createRandom = function (min, max) {
  var newRandom = Math.floor((Math.random() * max) + min);
  return newRandom;
}
