// models/index.js
const mongoose = require("mongoose");
const dbConfig = require("../config/dbconfig");
const Role = require("./role.model");

mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");

    // Initialize roles if not already present
    initial();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

async function initial() {
  try {
    const count = await Role.countDocuments();

    if (count === 0) {
      await Promise.all([
        new Role({ name: "user" }).save(),
        new Role({ name: "admin" }).save(),
      ]);

      console.log("Added default roles (user, admin) to roles collection");
    }
  } catch (err) {
    console.error("Error initializing roles:", err);
  }
}

module.exports = {
  User: require("./user.model"),
  Role: require("./role.model"),
};
