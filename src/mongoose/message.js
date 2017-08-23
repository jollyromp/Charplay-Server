// Setup Mongoose

var mongoose = require('mongoose')
, Schema = mongoose.Schema;

// Message schema
var messageSchema = new Schema({
    _author: { type: String, required: true, ref: 'User' },
    _character: { type: String, required: true, ref: 'Character' },
    _room: { type: String, required: true, ref: 'Room', index: true },
    content: { type: String, required: true }
  });

var Message = mongoose.model('Message', messageSchema);

export default Message;