// Setup Mongoose

var mongoose = require('mongoose')
, Schema = mongoose.Schema;

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

  let user = this;
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
    let z = '0';
    let width = 4;
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

// Exporting Schema

var User = mongoose.model('User', userSchema);

export default User;