// Set up mongoose

var mongoose = require('mongoose');
var model = require('./model.js');
var User = model.User;
var Character = model.Character;
var Room = model.Room;
var Message = model.Message;

// Connect to Socket
const io = require('socket.io')();

io.on('connection', (client) => {

  client.on('getRoomList', (data) => {
    Room.find({}, '_id name description url', function(err, roomList) {
      client.emit('sendRoomList', roomList);
    });
  });

  client.on('getRoom', (data) => {
    Room.findOne({'url': data}).populate('_owners').exec(function (err, room) {
      if (err) throw err;

      client.join('room.'+room._id);

      data = {'room': room };

      client.emit('sendRoomInfo', data);

      Message.find({'_room': data.room._id}).populate({ path: '_author', select: 'name _id' }).populate('_character').exec(function (err, messages) {
        if (err) throw err;

        data = { 'messages': messages };

        client.emit('sendRoomInfo', data);
      });
    });
  });

  client.on('sendMessage', (data) => {
    var newMessage = Message({
      _author: data.user,
      _character: data.character,
      _room: data.room,
      content: data.text
    });
    Message.create(newMessage, function (err) {
      if (err) throw err;

      Message.findOne({'_id': arguments[1]._id}).populate({ path: '_author', select: 'name _id' }).populate('_character').exec(function (err, messages) {
        if (err) throw err;
        messageData = {'messages': [messages], 'asdf': 'asdf'};
        client.to('room.'+data.room).emit('sendRoomInfo', messageData);
        client.emit('sendRoomInfo', messageData);
      });
    });
  });

});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
