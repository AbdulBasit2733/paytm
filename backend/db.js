const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  firstname: {
    type: String,
    trim: true,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    maxLength: 50,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel };
