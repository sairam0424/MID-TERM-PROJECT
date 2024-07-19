/* The code snippet is defining three different functions that handle requests and send responses for
different access levels. 
- `exports.allAccess` function sends "Public Content" when accessed.
- `exports.userBoard` function sends "User Content" when accessed.
- `exports.adminBoard` function sends "Admin Content" when accessed. */
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content");
};
