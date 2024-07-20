/*JsonWebTokens functions like verify() or sign() use the algorithim that needs an secret key(as String) to endcode and decode token, so we config an secret key for security*/
//where the my secret key is used for resolving our authentication problem
module.exports = {
  secret: "my-secret-key",
};
