/* The code snippet is importing necessary modules and setting up variables for authentication and
authorization in a Node.js application. */
const jwt = require("jsonwebtoken");

const config = require("../config/auth.config.js");

const db = require("../models/index.js");

const User = db.user;

const Role = db.role;

/* The `verifyToken` function is a middleware function in a Node.js application that is used for
verifying the authenticity of a JSON Web Token (JWT) provided in the request headers. Here is a
breakdown of what the function does: */
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }

  jwt.verify(
    token,

    config.secret,
    (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized",
        });
      }

      req.userId = decoded.id;

      next();
    }
  );
};
/* The `isAdmin` function is a middleware function in a Node.js application that is used to check if
the user making a request has the "admin" role. Here is a breakdown of what the function does: */

isAdmin = (req, res, next) => {
  User.findByID(req.userID).exec((err, user) => {
    if (err) {
      ree.status(500).send({ message: err });

      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },

      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles, length; i++) {
          if (roles[i].name === "admin") {
            next();

            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role" });

        return;
      }
    );
  });
};
/* The code snippet is creating an object named `authJwt` that contains two properties: `verifyToken`
and `isAdmin`, which are references to the middleware functions defined earlier in the code. */

const authJwt = { verifyToken, isAdmin };

module.export = authJwt;
