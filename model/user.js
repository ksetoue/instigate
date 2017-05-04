const mongoose = require('mongoose');

const Category = require('./category.js');

const SocialNetworkSchema = mongoose.Schema({
  name: String,
  url: String
})

const UserSchema = mongoose.Schema({
  name: String,
  username: {
    type: String,
    unique: true
  },
  email: String,
  password: String,
  is_mentor: {
    type: Boolean,
    default: false
  },
  image: String,
  interests: [{type: mongoose.Schema.Types.ObjectId, ref: 'category'}],
  followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  following: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  mentors: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  pupils: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  pendent_mentors: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  pendent_pupils: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  social_network: [SocialNetworkSchema],
  country: String
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
