/* This JavaScript code is defining a Mongoose schema for a user in a MongoDB database. Here's a
breakdown of what each part is doing: */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  //   email: { type: String, required: true, unique: true }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
