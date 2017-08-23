// Set up mongoose

import mongoose from 'mongoose';
import User from './src/mongoose/user';
import Character from './src/mongoose/character';
import Room from './src/mongoose/room';
import Message from './src/mongoose/message';

var uri = 'mongodb://localhost:27017/rpc';
mongoose.Promise = global.Promise;
mongoose.connect(uri, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

// Setup async

var async = require('async');

// Insert users

function insertUsers(cb) {
  
  var users = [
    User({
      _id: mongoose.Types.ObjectId("59988d2f5c222a4bdbae13e8"),
      username: "cor",
      tag: 1,
      password: "testpassword"
    }),
    User({
      username: "roc",
      tag: 2,
      password: "testpassword2"
    })
  ];

  User.collection.drop()
  User.create(users, function (err) {
    if (err) throw err;
    
    var data = {};
    data.user = arguments[1][0]._id;

    arguments[1][0].comparePassword('testpassword', (err, data) => {
      console.log("Comparing passwords...", data);
    });

    console.log("Inserted " + arguments[1].length + " documents into User.");
    
    for (var i=1; i<arguments.length; ++i) {
        var out = arguments[i];
        console.log(out);
    }
    cb(null, data);
  });
}

// Insert characters

function insertCharacters(data, cb) {
  var characters = [
    Character({
      _id: mongoose.Types.ObjectId("599684a989ccdb4e64aedd38"),
      _author: data.user,
      avatar: "http://i.imgur.com/8IMdzu3.jpg",
      gallery: [
        "http://i.imgur.com/neIEW0P.png",
        "http://i.imgur.com/8IMdzu3.jpg"
      ],
      name: "test",
      color: "#cdc"
    }),
    Character({
      _author: data.user,
      avatar: "http://i.imgur.com/neIEW0P.png",
      name: "test2",
      color: "#ccc"
    })
  ];

  Character.collection.drop();
  Character.create(characters, function (err) {
    if (err) throw err;

    data.character = arguments[1][0]._id;
    
    console.log("Inserted " + arguments[1].length + " documents into Character.");
    
    for (var i=1; i<arguments.length; ++i) {
        var out = arguments[i];
        console.log(out);
    }

    cb(null, data);
  });
}

// Insert rooms

function insertRooms(data, cb) {
  var room = Room({
    _id: new mongoose.Types.ObjectId('59969db958f68a563e616dc4'),
    _owners: [data.user],
    url: 'quiet-sunset-rJZpn8UOW',
    name: "Test Room",
    description: "This is a room with a description",
    color: "#0074D9"
  });

  Room.collection.drop();
  Room.create(room, function (err) {
    if (err) throw err;

    data.room = arguments[1]._id;
    
    console.log("Inserted document into Room.");
    console.log(arguments[1]);

    cb(null, data);
  });
}

// Insert messages
function insertMessages(data, cb) {
  var messages = [
    Message({
      _author: data.user,
      _character: data.character,
      _room: data.room,
      content: "1harleybins"
    }),
    Message({
      _author: data.user,
      _character: data.character,
      _room: data.room,
      content: "2harleybins"
    }),
    Message({
      _author: data.user,
      _character: data.character,
      _room: data.room,
      content: "3harleybins"
    })
  ];

  Message.collection.drop();
  Message.create(messages, function (err) {
    if (err) throw err;

    console.log("Inserted " + arguments[1].length + " documents into Message.");
    
    for (var i=1; i<arguments.length; ++i) {
        var out = arguments[i];
        console.log(out);
    }

    cb(null);
  });
}

// Close connection

function closeMongoose(cb) {
  mongoose.disconnect();
}

async.waterfall([insertUsers, insertCharacters, insertRooms, insertMessages, closeMongoose]);
