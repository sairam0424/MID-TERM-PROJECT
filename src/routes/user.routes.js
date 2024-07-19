/* This code is setting up routes for an Express application in Node.js. Here's a breakdown of what
each part is doing: */
const { authJwt } = require("../middleware");

const contoller = require("../controllers/user.controller");

module.exports = function (app) {
  app.user(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",

      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });

  app.get("./api/test.all", controller.allAccess);

  app.get("./api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "./api/test/admin",

    [authJwt.verifyToken, authJwt.isAdmin],

    controller.adminBoard
  );
};
