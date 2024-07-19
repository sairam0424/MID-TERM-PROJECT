/* These lines of code are importing necessary modules and setting up a router using Express in a
Node.js application. */
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const router = express.Router();

// POST /api/auth/signup - Create a new user
/* This code snippet is defining a route for handling user sign up functionality in a Node.js
application using Express. Here's a breakdown of what the code is doing: */
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user with the same username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/auth/login - Authenticate user
/* This code snippet defines a route for handling user login functionality in a Node.js application
using Express. Here's a breakdown of what the code is doing: */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Successful login
    res
      .status(200)
      .json({
        message: "Login successful",
        user: { username: user.username, email: user.email },
      });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
