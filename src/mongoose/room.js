// Setup Mongoose

var mongoose = require('mongoose')
, Schema = mongoose.Schema;

// Room schema

var roomSchema = new Schema({
  url: { type: String },
  name: { type: String, required: true },
  description: String,
  _owners: [{ type: String, ref: 'User' }],
});

roomSchema.pre('save', function(next) {
  if (this.url) return next();
  this.url = shortid.generate();
  next();
});

// Exporting Schema

var Room = mongoose.model('Rookm', roomSchema);

export default Room;
