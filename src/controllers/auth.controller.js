/* These lines of code are importing necessary modules and models for user authentication and
authorization functionality. Here's a breakdown: */
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.User;
const Role = db.Role;

/* The `exports.signup` function is responsible for handling the user registration process. Here's a
breakdown of what it does: */
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = new User({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
    });

    await newUser.save();

    // Assign roles if provided in request body
    if (req.body.roles) {
      const roles = await Role.find({ name: { $in: req.body.roles } });
      newUser.roles = roles.map((role) => role._id);
      await newUser.save();
    } else {
      const defaultRole = await Role.findOne({ name: "user" });
      newUser.roles = [defaultRole._id];
      await newUser.save();
    }

    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error in signup:", err);
    res.status(500).send({ message: "Internal server error" });
  }
};

/* The `exports.signin` function is responsible for handling the user authentication process. Here's a
breakdown of what it does: */
exports.signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).populate("roles", "-__v");

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: "HS256",
      expiresIn: 86400, // 24 hours
    });

    const authorities = user.roles.map(
      (role) => "ROLE_" + role.name.toUpperCase()
    );

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (err) {
    console.error("Error in signin:", err);
    res.status(500).send({ message: "Internal server error" });
  }
};
