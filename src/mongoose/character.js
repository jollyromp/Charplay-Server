// Setup Mongoose

var mongoose = require('mongoose')
, Schema = mongoose.Schema;

// Character schema

var characterSchema = new Schema({
    _author: { type: String, required: true, ref: 'User' },
    name: { type: String, required: true },
    color: { type: String, required: true },
    avatar: String,
    gallery: Array,
  });
  
// Exporting Schema

var Character = mongoose.model('character', characterSchema);

export default Character;