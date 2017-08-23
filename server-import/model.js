// Set up mongoose and connect to MongoDB

var mongoose = require('mongoose')
, Schema = mongoose.Schema
var uri = 'mongodb://localhost:27017/rpc';
mongoose.Promise = global.Promise;
mongoose.connect(uri, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

// Import id generator

var idGen = require('./id_gen');

// Setup bcrypt

var bcrypt = require('bcrypt');

// User schema
var userSchema = new Schema({
  tag: { type: String, index: { unique: true } },
  username: { type: String, required: true },
  password: { type: String, required: true}
});

userSchema.pre('save', function(next) {
  this.tag = padTag(this.tag);

  var user = this;
  if (!user.isModified('password')) return next();  

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

function padTag(n) {
  if (n < 10000) {
    z = '0';
    width = 4;
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  } else {
    return n;
  }
}

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  console.log("candidatePassword: ", candidatePassword);
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Character schema
var characterSchema = new Schema({
  _author: { type: String, required: true, ref: 'User' },
  name: { type: String, required: true },
  color: { type: String, required: true },
  avatar: String,
  gallery: Array,
});

// Room schema
var roomSchema = new Schema({
  url: { type: String },
  name: { type: String, required: true },
  description: String,
  _owners: [{ type: String, ref: 'User' }],
});

roomSchema.pre('save', function(next) {
  if (this.url) return next();
  this.url = idGen.generate();
  next();
});

// Message schema
var messageSchema = new Schema({
  _author: { type: String, required: true, ref: 'User' },
  _character: { type: Schema.Types.ObjectId, required: true, ref: 'Character' },
  _room: { type: Schema.Types.ObjectId, required: true, ref: 'Room', index: true },
  content: { type: String, required: true }
});

exports.User = mongoose.model('User', userSchema);
exports.Character = mongoose.model('Character', characterSchema);
exports.Room = mongoose.model('Room', roomSchema);
exports.Message = mongoose.model('Message', messageSchema);
