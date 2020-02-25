const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Event = require('../models/event.model');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: 'Full name can\'t be empty'
  },
  email: {
    type: String,
    required: 'Email can\'t be empty',
    unique: true
  },
  password: {
    type: String,
    required: 'Password can\'t be empty',
    minlength: [6, 'Password must be at least 6 characters long']
  },
  relationships: {
    followers: [{ type: String, ref: "User" }],
    following: [{ type: String, ref: "User" }]
  },
  saltSecret: String,
  posts: {
    userPosts: [{ type: String}]
  }
});

//Custom validation for email

userSchema.path('email').validate((val) => {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val);
}, 'Invalid e-mail.');

userSchema.pre('save', function(next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash;
      this.saltSecret = salt;
      next();
    })
  })
})

// Methods

userSchema.methods.verifyPassword = async function (password, hashed_pass) {
  const saltSecret = this.saltSecret;
  const isValid = await bcrypt.compare(password, hashed_pass);
  return isValid;
}

userSchema.methods.generateJwt = function () {
  return jwt.sign({_id: this._id},
  process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP
  });
}
mongoose.model('User', userSchema);
