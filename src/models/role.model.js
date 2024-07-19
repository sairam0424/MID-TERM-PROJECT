/* This code snippet is defining a Mongoose model for a Role entity. It first requires the Mongoose
library and then creates a new Mongoose model named "Role" using the `mongoose.model` method. The
model is defined with a schema that includes a single field `name` of type String. */
const mongoose = require("mongoose");

const Role = mongoose.model(
  "Role",

  new mongoose.Schema({
    name: String,
  })
);

module.exports = Role;
