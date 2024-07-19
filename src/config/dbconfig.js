/* This code snippet is exporting an object with three properties: `HOST`, `PORT`, and `DB`. The values
assigned to these properties are `"0:0:0:0"`, `27017`, and `"Data_db"` respectively. This object can
be imported and used in other parts of the codebase.Where the Host+Port follows the Url Format and Db specifies the Data Base Name where this three parameters are used for setting up the MongoDb */
module.exports = {
  HOST: "127.0.0.1",
  PORT: 27017,
  DB: "Data_db",
};
