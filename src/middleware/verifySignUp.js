/* The code snippet is importing necessary modules and defining constants for roles and user models.
Here's a breakdown: */
const db = require("../models");
const User = require("../models/user.model");

const ROLES = db.Role;

const user = db.User;

/* The `checkDuplicateUsernameOrEmail` function is a middleware function in Node.js that is used to
check if the provided username or email already exists in the database before allowing a user to
sign up. Here's a breakdown of what the function does: */
checkDuplicateUsernameOrEmail = (req, res, next) => {
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });

      return;
    }

    if (user) {
      res.status(400).send({ message: "Falied ! Usename in already in use!" });
      return;
    }

    User.findOne({
      email: req.body.email,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });

        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed!Email is already in use!" });

        return;
      }

      next();
    });
  });
};
/* The `checkRolesExisted` function is a middleware function in Node.js that is used to verify if the
roles provided in the request body exist in the predefined roles constant `ROLES`. Here's a
breakdown of what the function does: */

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed!Role ${req.body.roles[i]} does not exist!`,
        });

        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

module.exports = verifySignUp;
