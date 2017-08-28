// Setup Mongoose

var mongoose = require('mongoose')
, Schema = mongoose.Schema;

import User from './user';
import Room from './room';
import Character from './character';

// Message schema
var messageSchema = new Schema({
    _author: {
      type: String, required: true, ref: 'User',
      validate: {
        validator: function(_id, cb) {
          User.findOne({_id}, function(err,docs){
            if (err) {console.log(err); cb(true) }
            else cb(docs.length != 0);
          });
        },
        message: "Author doesn't exist!"
      }
    },
    _character: {
      type: String, required: true, ref: 'Character',
      validate: {
        validator: function(_id, cb) {
          Character.findOne({_id}, function(err,docs){
            if (err) {console.log(err); cb(true) }
            else cb(docs.length != 0);
          });
        },
        message: "Character doesn't exist!"
      }
    },
    _room: {
      type: String, required: true, ref: 'Room', index: true,
      validate: {
        validator: function(_id, cb) {
          Room.findOne({_id}, function(err,docs){
            if (err) {console.log(err); cb(true) }
            else cb(docs.length != 0);
          });
        },
        message: "Room doesn't exist!"
      }
    },
    content: {
      type: String, required: true,
      validate: {
        validator: function(v) {
          return v.trim().length != 0;
        },
        message: "Message is blank!"
      }
    }
  });

var Message = mongoose.model('Message', messageSchema);

export default Message;