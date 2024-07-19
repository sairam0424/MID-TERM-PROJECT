/* This code snippet is exporting two modules `authJwt` and `verifySignUp` from their respective files
`authJwt.js` and `verifySignUp.js`. These modules can then be imported and used in other parts of
the application. */
const authJwt = require("./authJwt");

const verifySignUp = require("./verifySignUp");

module.exports = {
  authJwt,
  verifySignUp,
};
